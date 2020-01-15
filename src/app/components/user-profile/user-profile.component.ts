import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/hal-resources/project.resource';
import { MatSelectChange } from '@angular/material/select';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Profil } from '../../shared/hal-resources/profile.resource';
import { ProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  allStatus: string[] = [];
  selectedStatus: string;
  selectedName: string;
  selectedSupervisorName: string;
  parameterName: string;
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
    this.profil.name = 'Prof. Dr. Max Mustermann';
    this.profil.adresse = 'Technische Hochschule Köln';
    this.profil.strasse = 'Steinmüllerallee 6';
    this.profil.plz = '51643 Gummersbach';
    this.profil.raum = 'Raum 1506';
    this.profil.phonenumber = '+49 2261-8196-6367';
    this.profil.mail = 'max.mustermann@th-koeln.de';
    this.profil.tags = ['ST1', 'MCI', 'KI'];
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
      this.isDozent = user.hasRole('professor');
      this.isStudent = user.hasRole('student');
    });
    this.route.params.subscribe(params => {});
  }

  ngOnInit() {
    this.selectedSupervisorName = 'Dozent';
    this.supervisorNameFilter('Dozent');
  }

  getAllProjects() {
    this.projectService
      .getAll()
      .subscribe(
        projects => (this.projects = projects),
        error => console.log(error),
        () => this.fillStatus(this.projects)
      );
  }

  statusFilter(status: string) {
    this.projectService
      .findByStatus(status)
      .subscribe(projects => (this.projects = projects));
  }

  supervisorNameFilter(supervisorName: string) {
    this.projectService
      .findBySupervisorName(supervisorName)
      .subscribe(projects => (this.projects = projects));
  }

  nameFilter(name: string) {
    if (this.selectedStatus) {
      this.projectService
        .findByStatus(this.selectedStatus)
        .subscribe(projects => this.filterProjects(projects, name));
    } else {
      this.projectService
        .getAll()
        .subscribe(projects => this.filterProjects(projects, name));
    }
  }

  filterProjectsByStatus(event: MatSelectChange) {
    const status = event.value;
    if (status) {
      this.selectedStatus = status;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.statusFilter(status);
      }
    } else {
      this.selectedStatus = null;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else if (this.selectedSupervisorName) {
        this.supervisorNameFilter(this.selectedSupervisorName);
      } else {
        this.getAllProjects();
      }
    }
  }

  filterProjectsByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.selectedName = name;
      this.nameFilter(name);
    } else {
      this.selectedName = null;
      if (this.selectedStatus) {
        this.statusFilter(this.selectedStatus);
      } else if (this.selectedSupervisorName) {
        this.supervisorNameFilter(this.selectedSupervisorName);
      } else {
        this.getAllProjects();
      }
    }
  }

  filterProjectsBySupervisorName(event: any) {
    const supervisorName = event.target.value;
    if (supervisorName) {
      this.selectedSupervisorName = supervisorName;
      this.supervisorNameFilter(this.selectedSupervisorName);
    } else {
      this.selectedSupervisorName = null;
      if (this.selectedStatus) {
        this.statusFilter(this.selectedStatus);
      } else if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.getAllProjects();
      }
    }
  }
  openProjectDialog(project: Project) {
    const dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(() => {
      this.supervisorNameFilter('Dozent');
    });
  }

  openProfileDialog(profile: Profil) {
    const dialog = this.dialog.open(ProfileDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: profile
    });

    dialog.afterClosed().subscribe(() => {
      this.supervisorNameFilter('Dozent');
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService
          .delete(project)
          .subscribe(
            () => {},
            error => console.log(error),
            () => this.getAllProjects()
          );
      }
    });
  }

  private fillStatus(projects: Project[]) {
    projects.forEach(project => this.allStatus.push(project.status));
    this.allStatus = this.allStatus.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }

  private filterProjects(projects: Project[], name?: string) {
    for (const project of projects as Project[]) {
      if (project.name.toLowerCase().includes(name.toLowerCase())) {
        this.filteredProjects.push(project);
      }
    }
    this.projects = this.filteredProjects;
    this.filteredProjects = [];
  }
}
