import { Component, OnInit } from '@angular/core';
import { StudyCourse } from '../../shared/hal-resources/study-course.resource';
import { StudyCourseService } from '../../core/services/study-course.service';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-module-detail',
  templateUrl: './study-course-details.component.html',
  styleUrls: ['./study-course-details.component.scss']
})
export class StudyCourseDetailsComponent implements OnInit {
  studyCourse: StudyCourse;
  studyCourseID: UUID;

  constructor(
    private studyCourseService: StudyCourseService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => (this.studyCourseID = params.id));
  }

  ngOnInit() {
    this.getStudyCourse();
  }

  private getStudyCourse() {
    this.studyCourseService.get(this.studyCourseID).subscribe(studyCourse => {
      this.studyCourse = studyCourse;
      this.studyCourse.getAndSetModuleArray().then();
    });
  }
}
