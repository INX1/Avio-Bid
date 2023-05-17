import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupWinnerComponent } from './popup-winner.component';
import { AppModule } from 'src/app/app.module';

describe('PopupWinnerComponent', () => {
  let component: PopupWinnerComponent;
  let fixture: ComponentFixture<PopupWinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
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
