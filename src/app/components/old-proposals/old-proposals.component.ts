import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ArchivedProposal } from '../../shared/hal-resources/archived-proposal.resource';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { ProposalService } from '../../core/services/proposal.service';
import { Proposal } from '../../shared/hal-resources/proposal.resource';
import { OldProposalContentService } from '../../core/services/old-proposal-content.service';

@Component({
  selector: 'app-old-proposals',
  templateUrl: './old-proposals.component.html',
  styleUrls: ['./old-proposals.component.scss']
})
export class OldProposalsComponent implements OnInit {
  proposalID: UUID;
  archivedProposals: ArchivedProposal[];
  proposal: Proposal;

  constructor(
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    private router: Router,
    private user: KeyCloakUser,
    private contentService: OldProposalContentService
  ) {
    this.route.params.subscribe(params => (this.proposalID = params.id));
  }

  ngOnInit() {
    this.getProposal();
  }

  getProposal() {
    this.proposalService
      .get(this.proposalID)
      .subscribe(
        proposal => (this.proposal = proposal),
        error1 => console.log(error1),
        () => this.getArchivedProposal()
      );
  }

  getArchivedProposal() {
    this.proposal
      .getArchivedProposals()
      .subscribe(
        archivedProposals => (this.archivedProposals = archivedProposals)
      );
  }

  patchProposalContent(content: string) {
    this.contentService.changeDescription(content);
    this.router.navigateByUrl('/proposal/' + this.proposal.id.toString());
  }
}
