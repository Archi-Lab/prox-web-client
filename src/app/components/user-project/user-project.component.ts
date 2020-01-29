import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Profil } from '../../shared/hal-resources/profile.resource';

@Component({
  selector: 'app-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.scss']
})
export class UserProjectComponent implements OnInit {
  hasPermission = false;
  profil: Profil = new Profil();
  adresse: String;
  strasse: String;
  plz: String;
  raum: String;
  phonenumber: String;
  mail: String;
  tags: String[] = ['ST1', 'MCI', 'KI'];
  isDozent: boolean;
  isStudent: boolean;

  constructor(
    private projectService: ProjectService,
    private user: KeyCloakUser,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
      this.isDozent = user.hasRole('professor');
      this.isStudent = user.hasRole('student');
    });
    this.route.params.subscribe(params => {});
    this.profil.phonenumber = 1234567;
    this.profil.mail = 'max.mustermann@th-koeln.de';
    this.profil.tags = ['ST1', 'MCI', 'KI'];
  }

  ngOnInit() {}
}
