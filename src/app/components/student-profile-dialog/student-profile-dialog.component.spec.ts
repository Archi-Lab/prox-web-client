import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileDialogComponent } from './student-profile-dialog.component';

describe('StudentProfileDialogComponent', () => {
  let component: StudentProfileDialogComponent;
  let fixture: ComponentFixture<StudentProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentProfileDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
