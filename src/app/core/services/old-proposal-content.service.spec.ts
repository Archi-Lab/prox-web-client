import { TestBed } from '@angular/core/testing';

import { OldProposalContentService } from './old-proposal-content.service';

describe('OldProposalContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OldProposalContentService = TestBed.get(OldProposalContentService);
    expect(service).toBeTruthy();
  });
});
