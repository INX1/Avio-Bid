import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomComponent } from './admin-room.component';
import { AppModule } from 'src/app/app.module';

describe('AdminRoomComponent', () => {
  let component: AdminRoomComponent;
  let fixture: ComponentFixture<AdminRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],

      declarations: [AdminRoomComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
