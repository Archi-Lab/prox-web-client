import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../shared/hal-resources/project.resource';
import { ProjectService } from '../../core/services/project.service';
import { UUID } from 'angular2-uuid';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Proposal } from '../../shared/hal-resources/proposal.resource';
import { ProposalService } from '../../core/services/proposal.service';
import { TemplateResource } from '../proposal-editor/template.resource';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  projectID: UUID;
  hasPermission = false;

  // Set false to hide the proposal-service features
  useProposalFeatures = true;

  proposals: Proposal[];
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
    if (this.useProposalFeatures) {
      this.getProposals();
      this.getPublishedProposals();
    }
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
    this.projectService
      .get(this.projectID)
      .subscribe(project => (this.project = project));
  }

  private getProposals() {
    if (this.user.hasRole('professor')) {
      this.proposalService
        .findByProjectId(this.projectID)
        .subscribe(proposals => (this.proposals = proposals));
    } else if (this.user.hasRole('student')) {
      this.proposalService
        .findByProjectIdAndStudentId(this.projectID, this.user.getID())
        .subscribe(proposals => (this.proposals = proposals));
    }
  }

  private getPublishedProposals() {
    this.proposalService
      .findPublishedProposals(this.projectID)
      .subscribe(
        publishedProposals => (this.publishedProposals = publishedProposals)
      );
  }

  createProposal() {
    const templateResource = new TemplateResource();
    const proposalResource: Proposal = new Proposal();
    proposalResource.content = templateResource.content;
    proposalResource.projectId = this.projectID;
    proposalResource.supervisorId = this.project.creatorID;
    proposalResource.studentId = this.user.getID();
    proposalResource.version = 1;
    proposalResource.lastUpdateBy = 'STUD';

    this.proposalService
      .create(proposalResource)
      .subscribe(
        () => this.proposals.push(proposalResource),
        error => console.log(error),
        () => this.router.navigateByUrl('/proposal/' + proposalResource.id)
      );
  }

  deleteProposal(proposal: Proposal) {
    this.proposalService.delete(proposal).subscribe(
      () => {},
      error => console.log(error),
      () =>
        this.router.navigateByUrl('/projects').then(() => {
          this.router.navigateByUrl('/projects/' + this.projectID);
        })
    );
  }
}
