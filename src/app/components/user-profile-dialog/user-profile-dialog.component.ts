import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { Professor } from '../../shared/hal-resources/professor.resource';
import { ProfessorService } from '../../core/services/professor.service';
import { Router } from '@angular/router';

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
      mail: [''],
      tags: [''],
      aboutMe: ['']
    });

    this.fillInProjectValuesIfProjectExists();
  }

  closeDialog() {
    this.profileDialogRef.close();
  }

  fillInProjectValuesIfProjectExists() {
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
      var tagsString: String = '';
      if (this.professor.tags) {
        this.professor.tags.forEach(function(value) {
          tagsString += value + ';';
        });
        tagsString = tagsString.substr(0, tagsString.length - 1);
      }
      this.profileFormControl.controls.mail.setValue(this.professor.mail);
      this.profileFormControl.controls.tags.setValue(tagsString);
    } else {
      this.profileFormControl.controls.name.setValue('test');
    }
  }

  onSubmit(profil: Professor) {
    this.hasSubmitted = true;

    if (this.professor) {
      this.updateProfil(profil);
    }
  }

  private updateProfil(professor1: Professor) {
    this.professor.adresse = professor1.adresse;
    this.professor.strasse = professor1.strasse;
    this.professor.title = professor1.title;
    this.professor.plz = professor1.plz;
    this.professor.raum = professor1.raum;
    this.professor.phoneNumber = professor1.phonenumber;
    this.professor.mail = professor1.mail;
    this.professor.aboutMe = professor1.aboutMe;
    if (professor1.tags.toString().trim().length == 0) {
      this.professor.tags = [];
    } else {
      this.professor.tags = professor1.tags.toString().split(';');
    }
    this.professorService.create(this.professor).subscribe(
      updateProf => {
        this.professor = updateProf;
        console.log(updateProf);
      },
      error => {
        console.log(error);
      }
    );
    this.closeDialog();
  }

  deleteProfile() {
    this.professorService.delete(this.professor).subscribe(
      deleteProf => {
        this.professor = deleteProf;
        console.log(deleteProf);
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