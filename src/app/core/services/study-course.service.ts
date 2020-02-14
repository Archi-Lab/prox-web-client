import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService extends RestService<StudyCourse> {
  constructor(injector: Injector) {
    super(StudyCourse, 'studyCourses', injector);
  }

  findByAcademicDegree(academicDegree: string): Observable<StudyCourse[]> {
    const options: any = {
      params: [{ key: 'academicDegree', value: academicDegree }]
    };
    return this.search('findByAcademicDegree', options);
  }
}
