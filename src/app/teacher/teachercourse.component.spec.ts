import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachercourseComponent } from './teachercourse.component';

describe('TeachercourseComponent', () => {
  let component: TeachercourseComponent;
  let fixture: ComponentFixture<TeachercourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachercourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachercourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
