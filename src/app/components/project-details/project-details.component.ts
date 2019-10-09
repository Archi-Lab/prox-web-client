import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../shared/hal-resources/project.resource';
import { ProjectService } from '../../core/services/project.service';
import { UUID } from 'angular2-uuid';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { MatDialog } from '@angular/material';
import { Proposal } from '../../shared/hal-resources/proposal-resource';
import { ProposalService } from '../../core/services/proposal.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  projectID: UUID;
  hasPermission = false;

  proposals: Proposal[];
  studentProposals: Proposal[];
  publishedProposals: Proposal[];

  constructor(
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    private router: Router,
    private user: KeyCloakUser,
    public dialog: MatDialog
  ) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
    });
    this.route.params.subscribe(params => {
      this.projectID = params.id;
    });
  }

  ngOnInit() {
    this.getProject();
    this.getProposals();
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
            () => this.router.navigateByUrl('/projects')
          );
      }
    });
  }

  openProjectDialog(project: Project) {
    const dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }

  private getProject() {
    this.projectService.get(this.projectID).subscribe(project => (this.project = project));
  }

  getProposals() {
    this.proposalService
      .findByProjectId(this.projectID.toString())
      .subscribe(
        proposals => (this.proposals = proposals),
        error1 => {},
        () => this.filterProposals()
      );
  }

  filterProposals() {
    this.studentProposals = this.proposals.filter(
      proposal => proposal.studentId === this.user.getID()
    );
    this.publishedProposals = this.proposals.filter(proposal => proposal.isPublished());
  }

  createProposal() {
    let proposalResource: Proposal = new Proposal();
    proposalResource.content = 'Dies ist Beispieltext für das Exposé';
    proposalResource.projectId = this.projectID;
    proposalResource.supervisorId = this.project.creatorID;
    proposalResource.studentId = this.user.getID();

    this.proposalService
      .create(proposalResource)
      .subscribe(() => console.log('Erfolg'), error1 => console.log(error1));
  }
}
