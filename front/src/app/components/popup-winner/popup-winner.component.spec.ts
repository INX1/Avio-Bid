import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupWinnerComponent } from './popup-winner.component';

describe('PopupWinnerComponent', () => {
  let component: PopupWinnerComponent;
  let fixture: ComponentFixture<PopupWinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupWinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
