import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveanswerFormComponent } from './giveanswer-form.component';

describe('GiveanswerFormComponent', () => {
  let component: GiveanswerFormComponent;
  let fixture: ComponentFixture<GiveanswerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveanswerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveanswerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
