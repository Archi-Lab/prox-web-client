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
import { Student } from '../../shared/hal-resources/student.resource';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './student-profile-dialog.component.html',
  styleUrls: ['./student-profile-dialog.component.scss']
})
export class StudentProfileDialogComponent implements OnInit {
  profileFormControl: FormGroup;
  studyCourses: StudyCourse[] = [];
  selectedModules: Module[] = [];
  hasSubmitted = false;

  constructor(
    public projectDialogRef: MatDialogRef<StudentProfileDialogComponent>,
    private profileService: ProfileService,
    private projectStudyCourseService: ProjectStudyCourseService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private user: KeyCloakUser,
    @Inject(MAT_DIALOG_DATA) public student: any
  ) {}

  ngOnInit() {
    this.profileFormControl = this.formBuilder.group({
      name: ['', [Validators.required]],
      phonenumber: ['', [Validators.required]],
      mail: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      aboutMe: [''],
      studiengang: [''],
      semester: [''],
      status: [''],
      doneModules: [''],
      doneJobs: ['']
    });

    this.fillInProjectValuesIfProjectExists();
  }

  closeDialog() {
    this.projectDialogRef.close();
  }

  fillInProjectValuesIfProjectExists() {
    if (this.student) {
      this.profileFormControl.controls.name.setValue(this.student.name);
      this.profileFormControl.controls.aboutMe.setValue(this.student.aboutMe);
      this.profileFormControl.controls.phonenumber.setValue(
        this.student.phonenumber
      );
      var tagsString: String = '';
      this.student.tags.forEach(function(value) {
        tagsString += value + ';';
      });
      tagsString = tagsString.substr(0, tagsString.length - 1);
      this.profileFormControl.controls.mail.setValue(this.student.mail);
      this.profileFormControl.controls.doneModules.setValue(
        this.student.doneModules
      );
      this.profileFormControl.controls.doneJobs.setValue(this.student.doneJobs);
      this.profileFormControl.controls.status.setValue(this.student.status);
      this.profileFormControl.controls.studiengang.setValue(
        this.student.studiengang
      );
      this.profileFormControl.controls.semester.setValue(this.student.semester);
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

  private showSubmitInfo(message: string) {
    this.snack.open(message, null, {
      duration: 2000
    });
  }

  onSubmit(student: Student) {
    this.hasSubmitted = true;

    if (this.student) {
      this.updateProfil(student);
    }
  }

  private updateProfil(student: Student) {
    this.student.name = student.name;
    this.student.phonenumber = student.phonenumber;
    this.student.mail = student.mail;
    this.student.aboutMe = student.aboutMe;
    this.student.studiengang = student.studiengang;
    this.student.schwerpunkt = student.schwerpunkt;
    this.student.semester = student.semester;
    this.student.status = student.status;
    this.student.doneModules = student.doneModules;
    this.student.doneJobs = student.doneJobs;
    this.student.tags = student.tags.toString().split(';');
    // this.profileService.update(this.profile);
    this.closeDialog();
  }
}
