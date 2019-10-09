import { TestBed } from '@angular/core/testing';

import { ArchivedProposalServiceService } from './archived-proposal-service.service';

describe('ArchivedProposalServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivedProposalServiceService = TestBed.get(ArchivedProposalServiceService);
    expect(service).toBeTruthy();
  });
});
