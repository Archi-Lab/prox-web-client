import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../core/services/project.service';
import {Project} from '../../shared/hal-resources/project.resource';
import {MatDialog, MatSelectChange} from '@angular/material';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {KeyCloakUser} from '../../keycloak/KeyCloakUser';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  allStatus: string[] = [];
  selectedStatus: string;
  selectedName: string;
  selectedSupervisorName: string;
  hasPermission = false;

  constructor(private projectService: ProjectService, private user: KeyCloakUser,
              public dialog: MatDialog) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('Dozent');
    });
  }

  ngOnInit() {
    this.getAllProjects();
  }

  deleteProject(project: Project) {
    this.projectService.delete(project).subscribe(
      () => {},
      error => console.log(error),
      () => this.getAllProjects()
    );
  }

  getAllProjects() {
    this.projectService.getAll().subscribe(
      projects => this.projects = projects,
      error => console.log(error),
      () => this.fillStatus(this.projects)
    );
  }

  statusFilter(status: string) {
    this.projectService.findByStatus(status).subscribe(
      projects => this.projects = projects
    );
  }

  supervisorNameFilter(creatorName: string) {
    this.projectService.findBySupervisorName(creatorName).subscribe(
      projects => this.projects = projects
    );
  }

  nameFilter(name: string) {
    if (this.selectedStatus) {
      this.projectService.findByStatus(this.selectedStatus).subscribe(
        projects => this.filterProjects(projects, name)
      );
    } else {
      this.projectService.getAll().subscribe(
        projects => this.filterProjects(projects, name)
      );
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

  filterProjectsByCreatorName(event: any) {
    const creatorName = event.target.value;
    if (creatorName) {
      this.selectedSupervisorName = creatorName;
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
    let dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      data: project
    });

    dialog.afterClosed().subscribe(() => {
      this.getAllProjects();
    });
  }

  private fillStatus(projects: Project[]) {
    projects.forEach(project => this.allStatus.push(project.status));
    this.allStatus = this.allStatus.filter((value, index, self) => self.indexOf(value) === index);
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
