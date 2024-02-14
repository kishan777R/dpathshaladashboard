import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturetopiclistComponent } from './lecturetopiclist.component';

describe('LecturetopiclistComponent', () => {
  let component: LecturetopiclistComponent;
  let fixture: ComponentFixture<LecturetopiclistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturetopiclistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturetopiclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
