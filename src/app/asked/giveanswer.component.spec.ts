import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveanswerComponent } from './giveanswer.component';

describe('GiveanswerComponent', () => {
  let component: GiveanswerComponent;
  let fixture: ComponentFixture<GiveanswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveanswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveanswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
