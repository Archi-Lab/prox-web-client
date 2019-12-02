import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedProposalsComponent } from './archived-proposals.component';

describe('ArchivedProposalsComponent', () => {
  let component: ArchivedProposalsComponent;
  let fixture: ComponentFixture<ArchivedProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivedProposalsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
