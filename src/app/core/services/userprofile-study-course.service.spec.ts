import { TestBed } from '@angular/core/testing';

import { UserProfileStudyCourseService } from './userprofile-study-course.service';

describe('UserProfileStudyCourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProfileStudyCourseService = TestBed.get(
      UserProfileStudyCourseService
    );
    expect(service).toBeTruthy();
  });
});
