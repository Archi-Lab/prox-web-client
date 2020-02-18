import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../shared/hal-resources/module.resource';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { Student } from '../../shared/hal-resources/student.resource';
import { StudentService } from '../../core/services/student.service';
import { HalOptions } from 'angular4-hal';
import { StudyCourseService } from '../../core/services/study-course.service';
import { Router } from '@angular/router';
import { ModuleService } from '../../core/services/module.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './student-profile-dialog.component.html',
  styleUrls: ['./student-profile-dialog.component.scss']
})
export class StudentProfileDialogComponent implements OnInit {
  profileFormControl: FormGroup;
  studyCourses: StudyCourse[] = [];
  hasSubmitted = false;
  modules: Module[] = [];

  constructor(
    public StudentDialogRef: MatDialogRef<StudentProfileDialogComponent>,
    private studentService: StudentService,
    private moduleService: ModuleService,
    private studyCourseService: StudyCourseService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private user: KeyCloakUser,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public student: any
  ) {}

  ngOnInit() {
    this.profileFormControl = this.formBuilder.group({
      name: [{ value: '', disabled: true }],
      phonenumber: [''],
      mail: [{ value: '', disabled: true }],
      aboutMe: [''],
      studiengang: [''],
      status: [''],
      doneModules: [''],
      doneJobs: ['']
    });

    this.fillInStudentValuesIfStudentExists();
    this.getAllStudyCourses();
    this.getAllModules();
  }

  closeDialog() {
    this.StudentDialogRef.close();
  }

  fillInStudentValuesIfStudentExists() {
    if (this.student) {
      this.profileFormControl.controls.name.setValue(this.student.name);
      this.profileFormControl.controls.aboutMe.setValue(this.student.aboutMe);
      this.profileFormControl.controls.phonenumber.setValue(
        this.student.phonenumber
      );
      this.profileFormControl.controls.mail.setValue(this.student.mail);
      this.profileFormControl.controls.doneModules.setValue(
        this.student.doneModules
      );
      this.profileFormControl.controls.doneJobs.setValue(this.student.doneJobs);
      this.profileFormControl.controls.status.setValue(this.student.status);
      this.profileFormControl.controls.studiengang.setValue(
        this.student.studiengang
      );
    }
  }

  getAllStudyCourses() {
    const options: HalOptions = { sort: [{ path: 'name', order: 'ASC' }] };
    this.studyCourseService.getAll(options).subscribe(
      (studyCourses: StudyCourse[]) => {
        this.studyCourses = studyCourses;
        this.getAllModules();
      },
      error => console.log(error)
    );
  }

  getAllModules() {
    if (this.student.studiengang && this.student.studiengang.length > 0) {
      this.studyCourses.forEach(studyCourse => {
        if (
          studyCourse.name + ' (' + studyCourse.academicDegree + ')' ==
          this.student.studiengang
        ) {
          studyCourse.getAndSetModuleArray().then(() => {
            this.modules = studyCourse.modules;
          });
        }
      });
    } else {
      const options: HalOptions = { sort: [{ path: 'modules', order: 'ASC' }] };
      this.moduleService.getAll(options).subscribe(
        (modules: Module[]) => {
          this.modules = modules;
        },
        error => console.log(error)
      );
    }
  }

  onSubmit(student: Student) {
    this.hasSubmitted = true;

    if (this.student) {
      this.updateStudent(student);
    }
  }

  private updateStudent(student: Student) {
    this.student.phonenumber = student.phonenumber;
    this.student.aboutMe = student.aboutMe;
    this.student.studiengang = student.studiengang;
    this.student.schwerpunkt = student.schwerpunkt;
    this.student.status = student.status;
    this.student.doneModules = student.doneModules;
    this.student.doneJobs = student.doneJobs;
    this.studentService.create(this.student).subscribe(
      updateStudent => {
        this.student = updateStudent;
        console.log(updateStudent);
      },
      error => {
        console.log(error);
      }
    );
    this.closeDialog();
  }

  deleteStudent() {
    if (confirm('Möchten Sie ihr Profil wirklich löschen?')) {
      this.studentService.delete(this.student).subscribe(
        deleteStudent => {
          this.student = deleteStudent;
          console.log(deleteStudent);
          this.router.navigateByUrl('/');
          alert(
            'Ihr Profil wurde erfolgreich gelöscht. Sie werden nun zur Startseite weitergeleitet.'
          );
        },
        error => {
          console.log(error);
        }
      );
      this.closeDialog();
    }
  }

  setModules($event: MatSelectChange) {
    this.studyCourses.forEach(studyCourse => {
      if (
        studyCourse.name + ' (' + studyCourse.academicDegree + ')' ==
        $event.value
      ) {
        studyCourse.getAndSetModuleArray().then(() => {
          this.modules = studyCourse.modules;
        });
      }
    });
  }
}
