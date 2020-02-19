import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
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
import { UserProfileStudyCourseService } from '../../core/services/userprofile-study-course.service';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';

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
  modules: Module[] = [];

  constructor(
    public StudentDialogRef: MatDialogRef<StudentProfileDialogComponent>,
    private studentService: StudentService,
    private moduleService: ModuleService,
    private studyCourseService: UserProfileStudyCourseService,
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    public dialog: MatDialog,
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
      modules: [''],
      doneJobs: ['']
    });

    this.getStudyCourses().then(() => {
      this.fillInStudentValuesIfStudentExists();
      this.getAllModules();
    });
  }

  getStudyCourses(): Promise<StudyCourse[]> {
    return new Promise<StudyCourse[]>((resolve, reject) => {
      this.studyCourseService.getAll().subscribe(
        tmpStudyCourses => (this.studyCourses = tmpStudyCourses),
        error => reject(error),
        () => {
          const modulePromises: Promise<Module[]>[] = [];

          for (const studyCourse of this.studyCourses) {
            modulePromises.push(studyCourse.getAndSetModuleArray());
          }

          Promise.all(modulePromises).then(() => resolve(this.studyCourses));
        }
      );
    });
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
      this.profileFormControl.controls.doneJobs.setValue(this.student.doneJobs);
      this.profileFormControl.controls.status.setValue(this.student.status);
      this.profileFormControl.controls.studiengang.setValue(
        this.student.studiengang
      );
      this.student.getModules().subscribe(modules => {
        this.setSelectedModules(modules);
      });
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

  private updateStudent(student: Student) {
    this.student.phonenumber = student.phonenumber;
    this.student.aboutMe = student.aboutMe;
    this.student.studiengang = student.studiengang;
    this.student.schwerpunkt = student.schwerpunkt;
    this.student.status = student.status;
    this.student.doneJobs = student.doneJobs;
    this.studentService.update(this.student).subscribe(
      updateStudent => {
        this.student.setModules(this.selectedModules).then(
          () => {
            this.showSubmitInfo('Die Daten wurden aktualisiert');
            console.log(updateStudent);
            this.student = updateStudent;
          },
          error => {
            this.showSubmitInfo('Fehler beim Verknüpfen der Module');
            console.log(error);
          }
        );
      },
      error => {
        this.showSubmitInfo('Fehler bei der Aktualisierung');
        console.log(error);
      }
    );
    this.closeDialog();
  }

  deleteStudent() {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: 'Profil Löschen',
        message: 'Möchten Sie ihr Profil wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.delete(this.student).subscribe(
          deleteStudent => {
            this.student = deleteStudent;
            console.log(deleteStudent);
            this.router.navigateByUrl('/');
            alert(
              'Ihr Profil wurde erfolgreich gelöscht. Sie werden nun zur Startseite weitergeleitet.'
            );
            this.closeDialog();
          },
          error => {
            this.showSubmitInfo('Fehler beim Löschen Ihres Profils');
            console.log(error);
            this.closeDialog();
          }
        );
      } else {
        this.fillInStudentValuesIfStudentExists();
      }
    });
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

  private showSubmitInfo(message: string) {
    this.snack.open(message, null, {
      duration: 2000
    });
  }
}
