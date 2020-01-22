import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/hal-resources/project.resource';
import { Module } from '../../shared/hal-resources/module.resource';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { ProjectStudyCourseService } from '../../core/services/project-study-course.service';
import { Profil } from '../../shared/hal-resources/profile.resource';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profileFormControl: FormGroup;
  studyCourses: StudyCourse[] = [];
  selectedModules: Module[] = [];
  hasSubmitted = false;

  constructor(
    public projectDialogRef: MatDialogRef<ProfileDialogComponent>,
    private profileService: ProfileService,
    private projectStudyCourseService: ProjectStudyCourseService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private user: KeyCloakUser,
    @Inject(MAT_DIALOG_DATA) public profile: any
  ) {}

  ngOnInit() {
    this.profileFormControl = this.formBuilder.group({
      name: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      strasse: ['', [Validators.required]],
      plz: ['', [Validators.required]],
      raum: ['', [Validators.required]],
      phonenumber: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      aboutMe: ['']
    });

    this.fillInProjectValuesIfProjectExists();
  }

  closeDialog() {
    this.projectDialogRef.close();
  }

  fillInProjectValuesIfProjectExists() {
    if (this.profile) {
      this.profileFormControl.controls.name.setValue(this.profile.name);
      this.profileFormControl.controls.adresse.setValue(this.profile.adresse);
      this.profileFormControl.controls.strasse.setValue(this.profile.strasse);
      this.profileFormControl.controls.plz.setValue(this.profile.plz);
      this.profileFormControl.controls.raum.setValue(this.profile.raum);
      this.profileFormControl.controls.aboutMe.setValue(this.profile.aboutMe);
      this.profileFormControl.controls.phonenumber.setValue(
        this.profile.phonenumber
      );
      var tagsString: String = '';
      this.profile.tags.forEach(function(value) {
        tagsString += value + ';';
      });
      tagsString = tagsString.substr(0, tagsString.length - 1);
      this.profileFormControl.controls.mail.setValue(this.profile.mail);
      this.profileFormControl.controls.tags.setValue(tagsString);
    } else {
      this.profileFormControl.controls.name.setValue('test');
    }
  }

  setSelectedModules(modules: Module[]) {
    this.selectedModules = [];
    for (const module of modules) {
      const tmpModule: Module = this.getModuleBySelfLink(
        module._links.self.href
      );
      if (tmpModule) {
        this.selectedModules.push(tmpModule);
      }
    }
  }

  getModuleBySelfLink(selfLink: string): Module {
    for (const studyCourse of this.studyCourses) {
      for (const tmpModule of studyCourse.modules) {
        if (tmpModule._links.self.href === selfLink) {
          return tmpModule;
        }
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

  // getStudyCourses(): Promise<StudyCourse[]> {
  //   return new Promise<StudyCourse[]>((resolve, reject) => {
  //     this.projectStudyCourseService.getAllSorted().subscribe(
  //       tmpStudyCourses => (this.studyCourses = tmpStudyCourses),
  //       error => reject(error),
  //       () => {
  //         const modulePromises: Promise<Module[]>[] = [];
  //
  //         for (const studyCourse of this.studyCourses) {
  //           modulePromises.push(studyCourse.getAndSetModuleArray());
  //         }
  //
  //         Promise.all(modulePromises).then(() => resolve(this.studyCourses));
  //       }
  //     );
  //   });
  // }

  // createProjectResource(project: Project): Project {
  //   let projectResource: Project;
  //   if (this.project) {
  //     projectResource = this.project;
  //   } else {
  //     projectResource = new Project();
  //   }
  //
  //   projectResource.creatorID = this.user.getID();
  //   projectResource.creatorName = this.user.getFullName();
  //   projectResource.description = project.description;
  //   projectResource.name = project.name;
  //   projectResource.status = project.status;
  //
  //   if (project.supervisorName.length === 0) {
  //     projectResource.supervisorName = projectResource.creatorName;
  //   } else {
  //     projectResource.supervisorName = project.supervisorName;
  //   }
  //
  //   return projectResource;
  // }

  private showSubmitInfo(message: string) {
    this.snack.open(message, null, {
      duration: 2000
    });
  }

  // createProject(project: Project) {
  //   const newProject = this.createProjectResource(project);
  //
  //   // Create Project
  //   this.projectService.create(newProject).subscribe(
  //     () => {
  //       newProject.setModules(this.selectedModules).then(
  //         () => {
  //           this.showSubmitInfo('Projekt wurde erfolgreich erstellt');
  //           this.closeDialog();
  //         },
  //         error => {
  //           this.showSubmitInfo('Fehler beim Verknüpfen der Module');
  //           this.closeDialog();
  //           console.log(error);
  //         }
  //       );
  //     },
  //     error => {
  //       this.showSubmitInfo('Fehler beim Bearbeiten der Anfrage');
  //       this.hasSubmitted = false;
  //       console.log(error);
  //     }
  //   );
  // }

  // updateProject(project: Project) {
  //   this.project = this.createProjectResource(project);
  //
  //   // Update Project
  //   this.projectService.update(this.project).subscribe(
  //     () => {
  //       this.project.setModules(this.selectedModules).then(
  //         () => {
  //           this.showSubmitInfo('Projekt wurde erfolgreich bearbeitet');
  //           this.closeDialog();
  //         },
  //         error => {
  //           this.showSubmitInfo('Fehler beim Verknüpfen der Module');
  //           this.closeDialog();
  //           console.log(error);
  //         }
  //       );
  //     },
  //     error => {
  //       this.showSubmitInfo('Fehler beim Bearbeiten der Anfrage');
  //       this.hasSubmitted = false;
  //       console.log(error);
  //     }
  //   );
  // }

  onSubmit(profil: Profil) {
    this.hasSubmitted = true;

    if (this.profile) {
      this.updateProfil(profil);
    }
  }

  private updateProfil(profil: Profil) {
    this.profile.name = profil.name;
    this.profile.adresse = profil.adresse;
    this.profile.strasse = profil.strasse;
    this.profile.plz = profil.plz;
    this.profile.raum = profil.raum;
    this.profile.phonenumber = profil.phonenumber;
    this.profile.mail = profil.mail;
    this.profile.aboutMe = profil.aboutMe;
    this.profile.tags = profil.tags.toString().split(';');
    // this.profileService.update(this.profile);
    this.closeDialog();
  }
}
