import { TestBed } from '@angular/core/testing';

import { ArchivedProposalService } from './archived-proposal.service';

describe('ArchivedProposalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivedProposalService = TestBed.get(ArchivedProposalService);
    expect(service).toBeTruthy();
  });
});
