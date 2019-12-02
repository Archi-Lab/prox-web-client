import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute } from '@angular/router';
import { Proposal } from '../../shared/hal-resources/proposal.resource';
import { Project } from '../../shared/hal-resources/project.resource';
import { ProjectService } from '../../core/services/project.service';
import { ProposalService } from '../../core/services/proposal.service';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { FormControl } from '@angular/forms';
import { ArchivedProposalsContentService } from '../../core/services/archived-proposals-content.service';

export type ViewMode = 'editor' | 'preview';

@Component({
  selector: 'app-proposal-editor',
  templateUrl: './proposal-editor.component.html',
  styleUrls: ['./proposal-editor.component.scss']
})
export class ProposalEditorComponent implements OnInit {
  viewMode: ViewMode = 'editor';
  proposalID: UUID;
  proposal: Proposal;
  project: Project;
  proposalFormControl = new FormControl('');
  archived: any[];

  constructor(
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    public user: KeyCloakUser,
    private contentService: ArchivedProposalsContentService
  ) {
    this.route.params.subscribe(params => (this.proposalID = params.id));
  }

  ngOnInit() {
    this.loadProposal();
    this.proposalFormControl.setValue(this.proposal.content);
  }

  loadProposal() {
    this.proposalService.get(this.proposalID).subscribe(
      proposal => {
        this.proposal = proposal;
        this.proposalFormControl.setValue(proposal.content);
        // change content to an older version if an archived proposal is loaded
        this.loadOldContent();
      },
      error1 => console.log(error1),
      () => this.getProject()
    );
  }

  private getProject() {
    this.projectService.get(this.proposal.projectId).subscribe(project => {
      this.project = project;

      this.proposal.getArchivedProposals().subscribe(a => (this.archived = a));
    });
  }

  patchProposalContent() {
    this.proposal.content = this.proposalFormControl.value;

    if (this.user.hasRole('professor')) {
      this.proposal.lastUpdateBy = 'PROF';
    } else if (this.user.hasRole('student')) {
      this.proposal.lastUpdateBy = 'STUD';
    }
    this.proposalService.patch(this.proposal).subscribe();
  }

  permitPublishing() {
    if (this.user.hasRole('professor')) {
      this.proposal.supervisorPermitsPublish = true;
    } else if (this.user.hasRole('student')) {
      this.proposal.studentPermitsPublish = true;
    }
    this.proposalService.patch(this.proposal).subscribe();
  }

  disallowPublishing() {
    if (this.user.hasRole('professor')) {
      this.proposal.supervisorPermitsPublish = false;
    } else if (this.user.hasRole('student')) {
      this.proposal.studentPermitsPublish = false;
    }
    this.proposalService.patch(this.proposal).subscribe();
  }

  loadOldContent() {
    this.contentService.getDescription().subscribe(oldContent => {
      if (oldContent !== '') {
        this.proposalFormControl.setValue(oldContent);
        this.contentService.changeDescription('');
      }
    });
  }

  get showEditor() {
    return this.viewMode === 'editor';
  }

  get showPreview() {
    return this.viewMode === 'preview';
  }

  toggleViewMode(type: ViewMode) {
    this.viewMode = type;
  }
}
