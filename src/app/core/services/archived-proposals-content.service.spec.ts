import { TestBed } from '@angular/core/testing';

import { ArchivedProposalsContentService } from './archived-proposals-content.service';

describe('ArchivedProposalsContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivedProposalsContentService = TestBed.get(
      ArchivedProposalsContentService
    );
    expect(service).toBeTruthy();
  });
});
