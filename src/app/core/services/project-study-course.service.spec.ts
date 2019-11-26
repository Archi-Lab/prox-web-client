import { TestBed } from '@angular/core/testing';

import { ProjectStudyCourseService } from './project-study-course.service';

describe('ProjectStudyCourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectStudyCourseService = TestBed.get(
      ProjectStudyCourseService
    );
    expect(service).toBeTruthy();
  });
});
