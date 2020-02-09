/* tslint:disable:one-line */
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/hal-resources/project.resource';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProfessorService } from '../../core/services/professor.service';
import { Professor } from '../../shared/hal-resources/professor.resource';

@Component({
  selector: 'app-project-list',
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.scss']
})
export class ProfessorListComponent implements OnInit {
  professors: Professor[] = [];

  constructor(private professorService: ProfessorService) {}

  ngOnInit() {
    this.getAllProfessors();
  }

  getAllProfessors() {
    this.professorService
      .getAll()
      .subscribe(
        professos => (this.professors = professos),
        error => console.log(error)
      );
  }

  nameFilter(name: string) {
    this.professorService
      .findByName(name)
      .subscribe(professors => (this.professors = professors));
  }

  filterProfessorsByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.nameFilter(name);
    } else {
      this.getAllProfessors();
    }
  }
}
