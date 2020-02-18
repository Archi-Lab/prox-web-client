import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/hal-resources/project.resource';
import { MatSelectChange } from '@angular/material/select';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProfessorDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { Student } from '../../shared/hal-resources/student.resource';
import { StudentProfileDialogComponent } from '../student-profile-dialog/student-profile-dialog.component';
import { Professor } from '../../shared/hal-resources/professor.resource';
import { ProfessorService } from '../../core/services/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from '../../core/services/student.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  allStatus: string[] = [];
  selectedStatus: string;
  selectedName: string;
  selectedSupervisorName: string;
  hasPermission = false;
  professor: Professor;
  student: Student = new Student();
  isDozent: boolean;
  isStudent: boolean;
  private jsonString: string;
  professorId: UUID;
  studentId: UUID;
  isProfessorID: boolean;
  isStudentID: boolean;

  constructor(
    private projectService: ProjectService,
    private professorService: ProfessorService,
    private studentService: StudentService,
    private user: KeyCloakUser,
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.user.Load().then(() => {
      if (!this.professorId) {
        this.hasPermission = user.hasRole('professor');
        this.isDozent = user.hasRole('professor');
        this.isStudent = user.hasRole('student');
        if (this.isStudent) {
          this.loadStudent(
            this.user.getID(),
            this.user.getFullName(),
            this.student
          );
        }
        if (this.isDozent) {
          this.selectedSupervisorName = this.user.getFullName();
          this.supervisorNameFilter(this.user.getFullName());
          this.loadProfessor(
            this.user.getID(),
            this.user.getFullName(),
            this.professor
          );
        }
      } else {
        this.loadProfessorByID(this.professorId);
      }
    });
    this.route.params.subscribe(
      params => {
        this.professorId = params.id;
        this.studentId = params.id;
      },
      error => console.log(error)
    );
  }
  private fillProfessor(professor: Professor) {
    this.professor = professor;
    this.showSubmitInfo('Professor wurde Geladen');
  }

  private fillStudent(student1: Student) {
    this.student = student1;
    this.showSubmitInfo('Student wurde Geladen');
  }
  private createFirstProfessor(create: Boolean, id: string, name: string) {
    this.professor = new Professor();
    this.professor.keycloakId = id;
    this.professor.name = name;
    this.professor.title = ' ';
    this.professor.mail = this.user.getEmail();
    if (create) {
      this.professorService.create(this.professor).subscribe(
        newProfessor => {
          if (newProfessor instanceof Professor) {
            this.professor = newProfessor;
            this.showSubmitInfo('Professor wurde erfolgreich erstellt');
            if (
              confirm(
                'Sie sind zum ersten mal auf Ihrem Profil. Möchten Sie Daten über sich eintragen?'
              )
            ) {
              this.openProfileDialog(this.professor);
            }
          }
        },
        error => {
          this.showSubmitInfo('Fehler beim Bearbeiten der Anfrage');
          this.professor = new Professor();
        }
      );
    } else {
      this.showSubmitInfo('Professor wurde aus dem cach geladen');
    }
  }

  private createFirstStudent(create: Boolean, id: string, name: string) {
    this.student = new Student();
    this.student.name = name;
    this.student.keycloakId = id;
    this.student.mail = this.user.getEmail();
    if (create) {
      this.studentService.create(this.student).subscribe(
        newStudent => {
          if (newStudent instanceof Student) {
            this.student = newStudent;
            this.showSubmitInfo('Student wurde erfolgreich erstellt');
            if (
              confirm(
                'Sie sind zum ersten mal auf Ihrem Profil. Möchten Sie Daten über sich eintragen?'
              )
            ) {
              this.openProfileStudentDialog(this.student);
            }
          }
        },
        error => {
          this.showSubmitInfo('Fehler beim Bearbeitener Anfrage');
        }
      );
    } else {
      this.showSubmitInfo('Student wurde aus dem cach geladen');
    }
  }
  ngOnInit() {}

  getAllProjects() {
    this.projectService.getAll().subscribe(
      projects => (this.projects = projects),
      error => console.log(error),
      () => this.fillStatus(this.projects)
    );
  }

  statusFilter(status: string) {
    this.projectService
      .findByStatus(status)
      .subscribe(projects => (this.projects = projects));
  }

  supervisorNameFilter(supervisorName: string) {
    this.projectService.findBySupervisorName(supervisorName).subscribe(
      projects => (this.projects = projects),
      error => console.log(error),
      () => this.fillStatus(this.projects)
    );
  }

  nameFilter(name: string) {
    if (this.selectedStatus) {
      this.projectService
        .findByStatus(this.selectedStatus)
        .subscribe(projects => this.filterProjects(projects, name));
    } else {
      this.projectService
        .findBySupervisorName(this.selectedSupervisorName)
        .subscribe(projects => this.filterProjects(projects, name));
    }
  }

  filterProjectsByStatus(event: MatSelectChange) {
    const status = event.value;
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
      } else if (this.selectedSupervisorName) {
        this.supervisorNameFilter(this.selectedSupervisorName);
      } else {
        this.getAllProjects();
      }
    }
  }
  filterProjectsByName(event: any) {
    const name = event.target.value;
    if (name) {
      this.selectedName = name;
      this.nameFilter(name);
    } else {
      this.selectedName = null;
      if (this.selectedStatus) {
        this.statusFilter(this.selectedStatus);
      } else if (this.selectedSupervisorName) {
        this.supervisorNameFilter(this.selectedSupervisorName);
      } else {
        this.getAllProjects();
      }
    }
  }

  openProjectDialog(project: Project) {
    const dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }

  openProfileStudentDialog(student: Student) {
    const dialog = this.dialog.open(StudentProfileDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: student
    });
  }

  openProfileDialog(professor: Professor) {
    const dialog = this.dialog.open(ProfessorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: professor
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.delete(project).subscribe(
          () => {},
          error => console.log(error),
          () => this.supervisorNameFilter(this.selectedSupervisorName)
        );
      }
    });
  }

  private fillStatus(projects: Project[]) {
    projects.forEach(project => this.allStatus.push(project.status));
    this.allStatus = this.allStatus.filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }

  private filterProjects(projects: Project[], name?: string) {
    for (const project of projects as Project[]) {
      if (project.name.toLowerCase().includes(name.toLowerCase())) {
        this.filteredProjects.push(project);
      }
    }
    this.projects = this.filteredProjects;
    this.filteredProjects = [];
  }

  private showSubmitInfo(message: string) {
    this.snack.open(message, null, {
      duration: 2000
    });
  }

  private loadProfessor(uuid: string, name: string, professor: Professor) {
    if (this.user.getID()) {
      this.professorService.findByKeycloakId(uuid).subscribe(
        prof => {
          if (prof.length > 0) {
            prof.forEach(function(value) {
              if (value.keycloakId == uuid) {
                professor = value;
              }
            });
            if (!professor) {
              this.createFirstProfessor(true, uuid, name);
            } else {
              this.fillProfessor(professor);
            }
          } else {
            this.createFirstProfessor(true, uuid, name);
          }
        },
        error => {
          this.showSubmitInfo('Es ist ein Fehler aufgetreten.');
        }
      );
    }
  }

  private loadProfessorByID(uuid: UUID) {
    this.professorService.get(uuid).subscribe(
      prof => {
        this.professor = prof;
        this.isProfessorID = true;
        this.selectedSupervisorName = prof.name;
        this.supervisorNameFilter(prof.name);
      },
      error => {
        //zu der id wurde kein Professor gefunden. Somit ist es vllt. ein Student.
        this.loadStudentByID(this.studentId);
      }
    );
  }
  private loadStudentByID(uuid: UUID) {
    this.studentService.get(uuid).subscribe(
      student => {
        this.student = student;
        this.isStudentID = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  private loadStudent(uuid: string, name: string, student: Student) {
    if (this.user.getID()) {
      this.studentService.getAll().subscribe(
        stud => {
          if (stud.length > 0) {
            stud.forEach(function(value) {
              if (value.keycloakId == uuid) {
                student = value;
              }
            });
            if (!student) {
              this.createFirstStudent(true, uuid, name);
            } else {
              this.fillStudent(student);
            }
          } else {
            this.createFirstStudent(true, uuid, name);
          }
        },
        error => {
          this.showSubmitInfo('Es ist ein Fehler aufgetreten.');
        }
      );
    }
  }
}
