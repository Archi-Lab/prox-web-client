import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ArchivedProposal } from '../../shared/hal-resources/archived-proposal.resource';
import { ArchivedProposalService } from '../../core/services/archived-proposal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { ProposalService } from '../../core/services/proposal.service';
import { Proposal } from '../../shared/hal-resources/proposal-resource';
import { OldProposalContentService } from '../../core/services/old-proposal-content.service';

@Component({
  selector: 'app-old-proposals',
  templateUrl: './old-proposals.component.html',
  styleUrls: ['./old-proposals.component.scss']
})
export class OldProposalsComponent implements OnInit {
  projectID: UUID;
  archivedProposals: ArchivedProposal[];
  proposals: Proposal[];

  constructor(
    private archivedProposalService: ArchivedProposalService,
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    private router: Router,
    private user: KeyCloakUser,
    private contentService: OldProposalContentService
  ) {
    this.route.params.subscribe(params => (this.projectID = params.id));
  }

  ngOnInit() {
    this.getArchiveProposals();
    this.getProposals();
  }

  private getArchiveProposals() {
    this.archivedProposalService
      .findByProjectIdAndStudentIdOrderByVersionAsc(
        this.projectID.toString(),
        this.user.getID().toString()
      )
      .subscribe(archivedProposals => (this.archivedProposals = archivedProposals));
  }

  getProposals() {
    this.proposalService
      .findByProjectId(this.projectID.toString())
      .subscribe(proposals => (this.proposals = proposals));
  }

  patchProposalContent(proposal: Proposal, content: string) {
    proposal.content = content;
    this.contentService.changeDescription(content);
    this.router.navigateByUrl('/proposal/' + proposal.id.toString());
  }
}
