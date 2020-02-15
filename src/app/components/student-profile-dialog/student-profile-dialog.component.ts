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

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './student-profile-dialog.component.html',
  styleUrls: ['./student-profile-dialog.component.scss']
})
export class StudentProfileDialogComponent implements OnInit {
  profileFormControl: FormGroup;
  studyCourses: StudyCourse[] = [];
  hasSubmitted = false;

  constructor(
    public StudentDialogRef: MatDialogRef<StudentProfileDialogComponent>,
    private studentService: StudentService,
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
      mail: [''],
      tags: [''],
      aboutMe: [''],
      studiengang: [''],
      status: [''],
      doneModules: [''],
      doneJobs: ['']
    });

    this.fillInStudentValuesIfStudentExists();
    this.getAllStudyCourses();
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
      var tagsString: String = '';

      if (this.student.tags) {
        this.student.tags.forEach(function(value) {
          tagsString += value + ';';
        });
        tagsString = tagsString.substr(0, tagsString.length - 1);
      }
      this.profileFormControl.controls.mail.setValue(this.student.mail);
      this.profileFormControl.controls.doneModules.setValue(
        this.student.doneModules
      );
      this.profileFormControl.controls.doneJobs.setValue(this.student.doneJobs);
      this.profileFormControl.controls.status.setValue(this.student.status);
      this.profileFormControl.controls.studiengang.setValue(
        this.student.studiengang
      );
      this.profileFormControl.controls.tags.setValue(tagsString);
    }
  }

  getAllStudyCourses() {
    const options: HalOptions = { sort: [{ path: 'name', order: 'ASC' }] };
    this.studyCourseService.getAll(options).subscribe(
      (studyCourses: StudyCourse[]) => {
        this.studyCourses = studyCourses;
      },
      error => console.log(error)
    );
  }

  onSubmit(student: Student) {
    this.hasSubmitted = true;

    if (this.student) {
      this.updateStudent(student);
    }
  }

  private updateStudent(student: Student) {
    this.student.phonenumber = student.phonenumber;
    this.student.mail = student.mail;
    this.student.aboutMe = student.aboutMe;
    this.student.studiengang = student.studiengang;
    this.student.schwerpunkt = student.schwerpunkt;
    this.student.status = student.status;
    this.student.doneModules = student.doneModules;
    this.student.doneJobs = student.doneJobs;
    this.student.tags = student.tags.toString().split(';');
    if (student.tags.toString().trim().length == 0) {
      this.student.tags = [];
    } else {
      this.student.tags = student.tags.toString().split(';');
    }
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
}
