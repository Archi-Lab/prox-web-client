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
  hasSubmitted = false;

  constructor(
    public profileDialogRef: MatDialogRef<ProfileDialogComponent>,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
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
    this.profileDialogRef.close();
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
