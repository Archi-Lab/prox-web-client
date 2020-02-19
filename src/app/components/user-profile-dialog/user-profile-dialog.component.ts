import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { Professor } from '../../shared/hal-resources/professor.resource';
import { ProfessorService } from '../../core/services/professor.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.scss']
})
export class ProfessorDialogComponent implements OnInit {
  profileFormControl: FormGroup;
  studyCourses: StudyCourse[] = [];
  hasSubmitted = false;

  constructor(
    public profileDialogRef: MatDialogRef<ProfessorDialogComponent>,
    private professorService: ProfessorService,
    private formBuilder: FormBuilder,
    private user: KeyCloakUser,
    private router: Router,
    private snack: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public professor: any
  ) {}

  ngOnInit() {
    this.profileFormControl = this.formBuilder.group({
      name: [{ value: '', disabled: true }],
      adresse: [''],
      title: [''],
      strasse: [''],
      plz: [''],
      raum: [''],
      phonenumber: [''],
      mail: [{ value: '', disabled: true }],
      aboutMe: ['']
    });

    this.fillInProfessorValuesIfProfessorExists();
  }

  closeDialog() {
    this.profileDialogRef.close();
  }

  fillInProfessorValuesIfProfessorExists() {
    if (this.professor) {
      this.profileFormControl.controls.name.setValue(this.professor.name);
      this.profileFormControl.controls.adresse.setValue(this.professor.adresse);
      this.profileFormControl.controls.title.setValue(this.professor.title);
      this.profileFormControl.controls.strasse.setValue(this.professor.strasse);
      this.profileFormControl.controls.plz.setValue(this.professor.plz);
      this.profileFormControl.controls.raum.setValue(this.professor.raum);
      this.profileFormControl.controls.aboutMe.setValue(this.professor.aboutMe);
      this.profileFormControl.controls.phonenumber.setValue(
        this.professor.phonenumber
      );
      this.profileFormControl.controls.mail.setValue(this.professor.mail);
    }
  }

  onSubmit(profil: Professor) {
    this.hasSubmitted = true;

    if (this.professor) {
      this.updateProfessor(profil);
    }
  }

  private updateProfessor(professor1: Professor) {
    this.professor.adresse = professor1.adresse;
    this.professor.strasse = professor1.strasse;
    this.professor.title = professor1.title;
    this.professor.plz = professor1.plz;
    this.professor.raum = professor1.raum;
    this.professor.phonenumber = professor1.phonenumber;
    this.professor.aboutMe = professor1.aboutMe;
    this.professorService.create(this.professor).subscribe(
      updateProf => {
        this.professor = updateProf;
        this.showSubmitInfo('Die Daten wurden aktualisiert');
        console.log(updateProf);
      },
      error => {
        this.showSubmitInfo('Fehler bei der Aktualisierung');
        console.log(error);
      }
    );
    this.closeDialog();
  }

  deleteProfessor() {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: 'Profil Löschen',
        message: 'Möchten Sie ihr Profil wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.professorService.delete(this.professor).subscribe(
          deleteProf => {
            this.professor = deleteProf;
            console.log(deleteProf);
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
        this.fillInProfessorValuesIfProfessorExists();
      }
    });
  }

  private showSubmitInfo(message: string) {
    this.snack.open(message, null, {
      duration: 2000
    });
  }
}
