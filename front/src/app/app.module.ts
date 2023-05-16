import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CardInfoComponent } from './components/card-info/card-info.component';
import { PopupWinnerComponent } from './components/popup-winner/popup-winner.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuctionConfirmComponent } from './components/auction-confirm/auction-confirm.component';
import { HeroPageComponent } from './components/hero-page/hero-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoomComponent } from './components/admin-room/admin-room.component';
import { AdminHeroPageComponent } from './components/admin-room/admin-hero-page/admin-hero-page.component';
import { AdminPopUpComponent } from './components/admin-room/admin-pop-up/admin-pop-up.component';
import { RoomComponent } from './components/rooms/room/room.component';
import { RoomsComponent } from './components/rooms/rooms.component';

import { FlightService } from './services/flight.service';
import { AuctionService } from './services/auction.service';
import { UserService } from './services/user.service';

// Material Module
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RoomComponent,
    RoomsComponent,
    CardInfoComponent,
    PopupWinnerComponent,
    FooterComponent,
    AuctionConfirmComponent,
    HeroPageComponent,
    AdminRoomComponent,
    AdminHeroPageComponent,
    AdminPopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [AuctionService, FlightService, UserService],
  bootstrap: [AppComponent]
})

export class AppModule { }