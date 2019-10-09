import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldProposalsComponent } from './old-proposals.component';

describe('OldProposalsComponent', () => {
  let component: OldProposalsComponent;
  let fixture: ComponentFixture<OldProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OldProposalsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
