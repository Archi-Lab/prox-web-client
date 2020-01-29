import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/hal-resources/project.resource';
import { MatSelectChange } from '@angular/material/select';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Profil } from '../../shared/hal-resources/profile.resource';
import { ProfessorDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { Student } from '../../shared/hal-resources/student.resource';
import { StudentProfileDialogComponent } from '../student-profile-dialog/student-profile-dialog.component';
import { Professor } from '../../shared/hal-resources/professor.resource';
import { ProfessorService } from '../../core/services/professor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'angular4-hal/node_modules/rxjs';
import { StudentService } from '../../core/services/student.service';
import { error, log } from 'util';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  projects: Project[] = [];
  profArray: Professor[] = [];
  filteredProjects: Project[] = [];
  allStatus: string[] = [];
  selectedStatus: string;
  selectedName: string;
  selectedSupervisorName: string;
  hasPermission = false;
  profil: Profil = new Profil();
  professor: Professor;
  student: Student = new Student();
  isDozent: boolean;
  isStudent: boolean;
  private jsonString: string;

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
      this.hasPermission = user.hasRole('professor');
      this.isDozent = user.hasRole('professor');
      this.isStudent = user.hasRole('student');
      if (this.isStudent) {
        this.loadStudent(this.user.getID(), this.student);
      }
      if (this.isDozent) {
        this.loadProfessor(this.user.getID(), this.professor);
      }
    });
    this.route.params.subscribe(params => {});
  }
  private fillProfessor(professor: Professor) {
    this.professor = professor;
    this.showSubmitInfo('Professor wurde Geladen');
  }

  private fillStudent(student1: Student) {
    this.student = student1;
    this.showSubmitInfo('Student wurde Geladen');
  }
  private createFirstProfessor(create: Boolean, id: string) {
    this.professor = new Professor();
    this.professor.keycloakId = id;
    this.professor.name = 'Prof. Dr. Max Mustermann';
    this.professor.adresse = 'Technische Hochschule Köln';
    this.professor.strasse = 'Steinmüllerallee 6';
    this.professor.plz = '51643 Gummersbach';
    this.professor.raum = 'Raum 1506';
    this.professor.phonenumber = 22969992365;
    this.professor.mail = 'max.mustermann@th-koeln.de';
    this.professor.tags = ['ST1', 'MCI', 'KI'];
    this.professor.sprechzeiten = 'Montag - Freitag 10:00-11:30';
    this.professor.bildSrc = '';
    this.professor.aboutMe =
      'Hallo mein Name ist Prof. Dr. Max Mustermann und ich unterrichte seit 2018 an  ' +
      '  der TH-Köln. Schwerpunkte meiner Veranstaltungen liegen im Bereich den' +
      '    Softwareentwicklung und IT-Consulting.';
    this.jsonString = JSON.stringify(this.professor);

    if (create) {
      this.professorService.create(this.professor).subscribe(
        newProfessor => {
          if (newProfessor instanceof Professor) {
            this.professor = newProfessor;
            this.showSubmitInfo('Professor wurde erfolgreich erstellt');
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

  private createFirstStudent(create: Boolean, id: string) {
    this.student = new Student();
    this.student.name = 'Muster Student';
    this.student.phonenumber = 22969992365;
    this.student.mail = 'student.mustermann@th-koeln.de';
    this.student.tags = ['ST1', 'MCI', 'KI'];
    this.student.aboutMe =
      'In den letzten Jahren konnte ich bereits erste praktische Erfahrungen im\n' +
      '        Bereich des Handelsmarketings sammeln. ';
    this.student.studiengang = 'AI';
    this.student.schwerpunkt = '';
    this.student.semester = '5';
    this.student.status = 'Nicht Suchend';
    this.student.qualifikation = '';
    this.student.doneProjects = '';
    this.student.doneJobs =
      'Drei monatiges Prakitkum in der Firma MustermannIT.';
    this.student.doneModules = 'ST1, ST2, EBR, AP1, BPI, ALGO, MA1, BWL2';
    this.student.keycloakId = id;
    this.jsonString = JSON.stringify(this.student);

    if (create) {
      this.studentService.create(this.student).subscribe(
        newStudent => {
          if (newStudent instanceof Student) {
            this.student = newStudent;
            this.showSubmitInfo('Student wurde erfolgreich erstellt');
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
  initProfessor() {
    this.profil.tags = ['ST1', 'MCI', 'KI'];
  }

  initStudent() {
    this.student.name = 'Muster Student';
    this.student.phonenumber = 22969992365;
    this.student.mail = 'student.mustermann@th-koeln.de';
    this.student.tags = ['ST1', 'MCI', 'KI'];
    this.student.aboutMe =
      'In den letzten Jahren konnte ich bereits erste praktische Erfahrungen im\n' +
      '        Bereich des Handelsmarketings sammeln. Bei der Firma ABC GmbH habe ich\n' +
      '        ein neues Analysetool zur Verbesserung der Konditionsstruktur\n' +
      '        mitentwickeln und durfte nach dem Praktikum diese Kenntnisse im Rahmen\n' +
      '        einer Werksstudententätigkeit vertiefen und bei der Implementierung des\n' +
      '        Tools mitwirken. In meinem zweiten Praktikum bei der DEF KG konnte ich\n' +
      '        auf diese Erfahrung aufbauen, und habe dort im Verkauf direkt einen\n' +
      '        ersten eigenen Kunden betreut.';
    this.student.studiengang = 'AI';
    this.student.schwerpunkt = '';
    this.student.semester = '5';
    this.student.status = 'Nicht Suchend';
    this.student.qualifikation = '';
    this.student.doneProjects = '';
    this.student.doneJobs =
      'Drei monatiges Prakitkum in der Firma MustermannIT.';
    this.student.doneModules = 'ST1, ST2, EBR, AP1, BPI, ALGO, MA1, BWL2';
    this.student.keycloakId = this.user.getID();
  }

  ngOnInit() {
    this.selectedSupervisorName = 'Dozent';
    this.supervisorNameFilter('Dozent');
  }

  getAllProjects() {
    this.projectService
      .getAll()
      .subscribe(
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
    this.projectService
      .findBySupervisorName(supervisorName)
      .subscribe(projects => (this.projects = projects));
  }

  nameFilter(name: string) {
    if (this.selectedStatus) {
      this.projectService
        .findByStatus(this.selectedStatus)
        .subscribe(projects => this.filterProjects(projects, name));
    } else {
      this.projectService
        .getAll()
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

    dialog.afterClosed().subscribe(() => {
      this.supervisorNameFilter('Dozent');
    });
  }

  openProfileStudentDialog(student: Student) {
    const dialog = this.dialog.open(StudentProfileDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: student
    });

    dialog.afterClosed().subscribe(() => {
      this.supervisorNameFilter('Dozent');
    });
  }

  openProfileDialog(professor: Professor) {
    const dialog = this.dialog.open(ProfessorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: professor
    });

    dialog.afterClosed().subscribe(() => {
      this.supervisorNameFilter('Dozent');
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService
          .delete(project)
          .subscribe(
            () => {},
            error => console.log(error),
            () => this.getAllProjects()
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

  private loadProfessor(uuid: string, professor: Professor) {
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
              this.createFirstProfessor(true, uuid);
            } else {
              this.fillProfessor(professor);
            }
          } else {
            this.createFirstProfessor(true, uuid);
          }
        },
        error => {
          this.createFirstProfessor(true, uuid);
        }
      );
    }
  }

  private loadStudent(uuid: string, student: Student) {
    if (this.user.getID()) {
      this.studentService.getAll().subscribe(
        prof => {
          if (prof.length > 0) {
            prof.forEach(function(value) {
              if (value.keycloakId == uuid) {
                student = value;
              }
            });
            if (!student) {
              this.createFirstStudent(true, uuid);
            } else {
              this.fillStudent(student);
            }
          } else {
            this.createFirstStudent(true, uuid);
          }
        },
        error => {
          this.createFirstStudent(true, uuid);
        }
      );
    }
  }
}
