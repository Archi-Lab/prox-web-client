import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { Observable } from 'rxjs';
import { Module } from '../../shared/hal-resources/module.resource';

@Injectable({
  providedIn: 'root'
})
export class ProjectStudyCourseService extends RestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'projectStudyCourses', injector);
  }

  getAllSorted(): Observable<StudyCourse[]> {
    const options: any = {
      notPaged: true,
      params: [{ key: 'sort', value: 'name,asc' }]
    };
    return this.getAll(options);
  }
}
