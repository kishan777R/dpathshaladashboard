import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlecturetopicComponent } from './addlecturetopic.component';

describe('AddlecturetopicComponent', () => {
  let component: AddlecturetopicComponent;
  let fixture: ComponentFixture<AddlecturetopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlecturetopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlecturetopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
