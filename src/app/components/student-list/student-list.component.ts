/* tslint:disable:one-line */
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../core/services/student.service';
import { Student } from '../../shared/hal-resources/student.resource';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-project-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  allStatus: string[] = [];
  private filteredStudents: Student[] = [];
  private selectedName: string;
  private selectedStatus: string;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.getAllStudents();
  }

  getAllStudents() {
    this.studentService.getAll().subscribe(
      students => (this.students = students),
      error => console.log(error),
      () => this.fillStatus(this.students)
    );
  }

  nameFilter(name: string) {
    if (this.selectedStatus) {
      this.studentService
        .findByStatus(this.selectedStatus)
        .subscribe(students => this.filterStudents(students, name));
    } else {
      this.studentService.getAll().subscribe(
        students => this.filterStudents(students, name),
        error => console.log(error)
      );
    }
  }

  filterStudentsByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.selectedName = name;
      this.nameFilter(name);
    } else {
      this.selectedName = null;
      if (this.selectedStatus) {
        this.statusFilter(this.selectedStatus);
      } else {
        this.getAllStudents();
      }
    }
  }

  private filterStudents(students1: Student[], name?: string) {
    for (const students of students1 as Student[]) {
      if (students.name.toLowerCase().includes(name.toLowerCase())) {
        this.filteredStudents.push(students);
      }
    }
    this.students = this.filteredStudents;
    this.filteredStudents = [];
  }

  filterStudentsByStatus($event: MatSelectChange) {
    const status = $event.value;
    if (status) {
      this.selectedStatus = status;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.statusFilter(status);
      }
    } else {
      this.selectedStatus = null;
      if (this.selectedName) {
        this.nameFilter(this.selectedName);
      } else {
        this.getAllStudents();
      }
    }
  }

  statusFilter(status: string) {
    this.studentService
      .findByStatus(status)
      .subscribe(students => (this.students = students));
  }

  private fillStatus(students: Student[]) {
    students.forEach(student => this.allStatus.push(student.status));
    this.allStatus = this.allStatus.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }
}
