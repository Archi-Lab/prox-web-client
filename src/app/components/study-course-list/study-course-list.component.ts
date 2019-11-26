import { Component, OnInit } from '@angular/core';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { StudyCourseService } from '../../core/services/study-course.service';
import { HalOptions } from 'angular4-hal';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-module-list',
  templateUrl: './study-course-list.component.html',
  styleUrls: ['./study-course-list.component.scss']
})
export class StudyCourseListComponent implements OnInit {
  studyCourses: StudyCourse[] = [];
  filteredStudyCourses: StudyCourse[] = [];
  academicDegrees: string[] = [];
  selectedName: string;
  selectedAcademicDegree: string;

  constructor(private studyCourseService: StudyCourseService) {}

  ngOnInit() {
    this.getAllStudyCourses();
  }

  getAllStudyCourses() {
    const options: HalOptions = { sort: [{ path: 'name', order: 'ASC' }] };
    this.studyCourseService.getAll(options).subscribe(
      (studyCourses: StudyCourse[]) => {
        this.studyCourses = studyCourses;
      },
      error => console.log(error),
      () => this.fillAcademicDegrees(this.studyCourses)
    );
  }

  academicDegreeFilter(academicDegree: string) {
    this.studyCourseService
      .findByAcademicDegree(academicDegree)
      .subscribe(studyCourses => (this.studyCourses = studyCourses));
  }

  nameFilter(name: string) {
    if (this.selectedAcademicDegree) {
      this.studyCourseService
        .findByAcademicDegree(this.selectedAcademicDegree)
        .subscribe(studyCourses => this.filterStudyCourses(studyCourses, name));
    } else {
      this.studyCourseService
        .getAll()
        .subscribe(studyCourses => this.filterStudyCourses(studyCourses, name));
    }
  }

  filterStudyCoursesByAcademicDegree(event: MatSelectChange) {
    const academicDegree = event.value;
    if (academicDegree) {
      this.selectedAcademicDegree = academicDegree;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.academicDegreeFilter(academicDegree);
      }
    } else {
      this.selectedAcademicDegree = null;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.getAllStudyCourses();
      }
    }
  }

  filterStudyCoursesByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.selectedName = name;
      this.nameFilter(name);
    } else {
      this.selectedName = null;
      if (this.selectedAcademicDegree) {
        this.academicDegreeFilter(this.selectedAcademicDegree);
      } else {
        this.getAllStudyCourses();
      }
    }
  }

  private fillAcademicDegrees(studyCourses: StudyCourse[]) {
    studyCourses.forEach(studyCourse =>
      this.academicDegrees.push(studyCourse.academicDegree)
    );
    this.academicDegrees = this.academicDegrees.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }

  private filterStudyCourses(studyCourses: StudyCourse[], name?: string) {
    for (const studyCourse of studyCourses as StudyCourse[]) {
      if (studyCourse.name.toLowerCase().includes(name.toLowerCase())) {
        this.filteredStudyCourses.push(studyCourse);
      }
    }
    this.studyCourses = this.filteredStudyCourses;
    this.filteredStudyCourses = [];
  }
}
