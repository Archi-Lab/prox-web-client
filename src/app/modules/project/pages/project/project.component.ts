import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatSnackBar,
  MatDialog,
  PageEvent,
  MatPaginator
} from '@angular/material';

import { KeycloakService } from 'keycloak-angular';
import Fuse from 'fuse.js';

import { Project } from '@data/schema/project.resource';
import { ProjectService } from '@data/service/project.service';
import { ConfirmDialogComponent } from '@modules/project/components/confirm-dialog/confirm-dialog.component';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';

import { StatusOption } from './status-option.enum';
import { TagService } from '@data/service/tag.service';
import { Tag } from '@data/schema/tag.resource';
import { concatAll, map, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  public projectsPage: Project[] = [];
  public totalFilteredProjects = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public hasPermission = false;

  public searchString = new FormControl('');
  public selectedStatusOption = new FormControl(StatusOption.Verfuegbar);

  public StatusOption = StatusOption;
  public statusOptions = [
    StatusOption.Verfuegbar,
    StatusOption.Laufend,
    StatusOption.Abgeschlossen
  ];

  private projects: Project[] = [];
  private filteredProjects: Project[] = [];

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  constructor(
    private projectService: ProjectService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.hasPermission = this.keycloakService.isUserInRole('professor');
    } else {
      this.hasPermission = false;
    }

    this.getProjects();
  }

  public filterProjects() {
    let filteredProjects = this.projects.filter(({ status }) =>
      this.selectedStatusOption.value
        ? status === this.selectedStatusOption.value
        : true
    );

    for (const project of filteredProjects) {
      project.getTags().subscribe(
        tags => {
          project.tagCollection = tags;
        },
        error => console.error('tag service error', error)
      );
    }

    if (this.searchString.value) {
      const fuseOptions: Fuse.IFuseOptions<Project> = {
        minMatchCharLength: this.searchString.value.length,
        threshold: 0.1,
        distance: Number.MAX_SAFE_INTEGER,
        keys: [
          {
            name: 'name',
            weight: 0.25
          },
          {
            name: 'description',
            weight: 0.05
          },
          {
            name: 'shortDescription',
            weight: 0.05
          },
          {
            name: 'requirement',
            weight: 0.2
          },
          {
            name: 'supervisorName',
            weight: 0.25
          },
          {
            name: 'tagCollection.tagName',
            weight: 0.2
          }
        ]
      };
      const fuse = new Fuse(filteredProjects, fuseOptions);
      const results = fuse.search(this.searchString.value);

      filteredProjects = results.map(result => result.item);
    }
    this.filteredProjects = filteredProjects;
    this.totalFilteredProjects = this.filteredProjects.length;
    this.pageProjects();
    this.paginator.firstPage();
  }

  public deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.delete(project).subscribe(
          () => {
            this.projects = this.projects.filter(p => p !== project);
            this.filterProjects();
          },
          error => console.error('project service error', error)
        );
      }
    });
  }

  public openProjectEditorDialog(project: Project) {
    const dialog = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });

    dialog.afterClosed().subscribe(savedProject => {
      if (savedProject) {
        if (!this.projects.includes(savedProject)) {
          this.projects.unshift(savedProject);
        }
        this.filterProjects();
      }
    });
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProjects();
  }

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }

  private getProjects() {
    this.projectService.getAll().subscribe(
      projects => {
        this.projects = projects;
        this.filterProjects();
      },
      error => {
        console.error('project service error', error);
        this.openErrorSnackBar(
          'Projekte konnten nicht geladen werden! Versuchen Sie es später noch mal.'
        );
      }
    );
  }

  private pageProjects() {
    this.projectsPage = this.filteredProjects.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }
}
