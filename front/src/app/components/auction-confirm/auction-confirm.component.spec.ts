import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionConfirmComponent } from './auction-confirm.component';

describe('AuctionConfirmComponent', () => {
  let component: AuctionConfirmComponent;
  let fixture: ComponentFixture<AuctionConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
