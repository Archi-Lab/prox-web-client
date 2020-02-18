/* tslint:disable:one-line */
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../core/services/student.service';
import { Student } from '../../shared/hal-resources/student.resource';

@Component({
  selector: 'app-project-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  private filteredProjects: Student[];

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.getAllStudents();
  }

  getAllStudents() {
    this.studentService.getAll().subscribe(
      students => (this.students = students),
      error => console.log(error)
    );
  }

  nameFilter(name: string) {
    this.studentService.getAll().subscribe(
      students => this.filterStudents(students, name),
      error => console.log(error)
    );
  }

  filterStudentsByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.nameFilter(name);
    } else {
      this.getAllStudents();
    }
  }

  private filterStudents(students1: Student[], name?: string) {
    for (const students of students1 as Student[]) {
      if (students.name.toLowerCase().includes(name.toLowerCase())) {
        this.filteredProjects.push(students);
      }
    }
    this.students = this.filteredProjects;
    this.filteredProjects = [];
  }
}
