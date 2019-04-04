import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/hal-resources/project.resource';
import {Module} from '../../shared/hal-resources/module.resource';
import {ModuleService} from '../../core/services/module.service';
import {HalOptions, Resource} from "angular4-hal";
import {UUID} from "angular2-uuid";
import {isPrimitive} from "util";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {StudyCourse} from "../../shared/hal-resources/study-course.resource";
import {KeyCloakUser} from "../../keycloak/KeyCloakUser";
import {ProjectStudyCourseService} from "../../core/services/project-study-course.service";

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent implements OnInit {
  projectFormControl: FormGroup;
  studyCourses: StudyCourse[] = [];
  selectedModules: Module[] = [];
  hasSubmitted: boolean = false;

  constructor(public projectDialogRef: MatDialogRef<ProjectDialogComponent>,
              private projectService: ProjectService,
              private projectStudyCourseService: ProjectStudyCourseService,
              private formBuilder: FormBuilder,
              private snack: MatSnackBar,
              private user: KeyCloakUser,
              @Inject(MAT_DIALOG_DATA) public project: any) {
  }

  ngOnInit() {
    this.projectFormControl = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      supervisorName: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this.getStudyCourses().then((modules) => {
      this.fillInProjectValuesIfProjectExists();
    });
  }

  closeDialog() {
    this.projectDialogRef.close();
  }

  fillInProjectValuesIfProjectExists() {
    if (this.project) {
      this.projectFormControl.controls.name.setValue(this.project.name);
      this.projectFormControl.controls.description.setValue(this.project.description);
      this.projectFormControl.controls.supervisorName.setValue(this.project.supervisorName);
      this.projectFormControl.controls.status.setValue(this.project.status);

      this.project.getModules().subscribe(
        modules => {
          this.setSelectedModules(modules);
        }
      );
    }
  }

  buildModuleIdentifier(studyCourse: StudyCourse, module: Module) : string {
    let identifier : string = module.name;
    identifier = identifier.concat(" {" + studyCourse.name + "}");

    return identifier;
  }

  setSelectedModules(modules: Module[]) {
    this.selectedModules = [];
    for (let module of modules) {
      let tmpModule : Module = this.getModuleBySelfLink(module._links.self.href);
      if (tmpModule) {
        this.selectedModules.push(tmpModule);
      }
    }
  }

  getModuleBySelfLink(selfLink: string) : Module {
    for (let studyCourse of this.studyCourses) {
      for (let tmpModule of studyCourse.modules) {
        if (tmpModule._links.self.href === selfLink)
          return tmpModule;
      }
    }
    return null;
  }

  onSelectModule(module: Module) {
    if (this.selectedModules.includes(module)) {
      const index = this.selectedModules.indexOf(module, 0);
      if (index > -1) {
        this.selectedModules.splice(index, 1);
      }
    } else {
      this.selectedModules.push(module);
    }
  }

  getStudyCourses() : Promise<StudyCourse[]> {
    return new Promise<StudyCourse[]> ((resolve, reject) => {
      this.projectStudyCourseService.getAll()
        .subscribe(tmpStudyCourses => this.studyCourses = tmpStudyCourses,
            error => reject(error),
          () => {
            let modulePromises : Promise<Module[]>[] = [];

            for (let studyCourse of this.studyCourses) {
              modulePromises.push(studyCourse.getAndSetModuleArray());
            }

            Promise.all(modulePromises).then(() => resolve(this.studyCourses));
          }
        );
      }
    );
  }

  createProjectResource(project: Project) : Project {
    let projectResource : Project;
    if (this.project) {
      projectResource = this.project;
    } else {
      projectResource = new Project();
    }

    projectResource.creatorID = this.user.getID();
    projectResource.creatorName = this.user.getFullName();
    projectResource.description = project.description;
    projectResource.name = project.name;
    projectResource.status = project.status;

    if (project.supervisorName.length == 0) {
      projectResource.supervisorName = projectResource.creatorName;
    } else {
      projectResource.supervisorName = project.supervisorName;
    }

    return projectResource;
  }

  private showSubmitInfo(message: string) {
    this.snack.open(message, null, {
      duration: 2000,
    });
  }

  createProject(project: Project) {
    let newProject = this.createProjectResource(project);

    // Create Project
    this.projectService.create(newProject).subscribe(
      () => {
        newProject.setModules(this.selectedModules).then(() => {
          this.showSubmitInfo("Projekt wurde erfolgreich erstellt");
          this.closeDialog();
        },
        (error) => {
          this.showSubmitInfo("Fehler beim Verknüpfen der Module");
          this.closeDialog();
          console.log(error);
        });
      },
      error => {
        this.showSubmitInfo("Fehler beim Bearbeiten der Anfrage");
        this.hasSubmitted = false;
        console.log(error);
      }
    );
  }

  updateProject(project: Project) {
    this.project = this.createProjectResource(project);

    // Update Project
    this.projectService.update(this.project).subscribe(
      () => {
        this.project.setModules(this.selectedModules).then(() => {
          this.showSubmitInfo("Projekt wurde erfolgreich bearbeitet");
          this.closeDialog();
        },
        (error) => {
          this.showSubmitInfo("Fehler beim Verknüpfen der Module");
          this.closeDialog();
          console.log(error);
        });
      },
      error => {
        this.showSubmitInfo("Fehler beim Bearbeiten der Anfrage");
        this.hasSubmitted = false;
        console.log(error);
      }
    );
  }

  onSubmit(project: Project) {
    this.hasSubmitted = true;

    if (this.project) {
      this.updateProject(project);
    } else {
      this.createProject(project);
    }
  }
}
