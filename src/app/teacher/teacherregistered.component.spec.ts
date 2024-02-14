import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherregisteredComponent } from './teacherregistered.component';

describe('TeacherregisteredComponent', () => {
  let component: TeacherregisteredComponent;
  let fixture: ComponentFixture<TeacherregisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherregisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
