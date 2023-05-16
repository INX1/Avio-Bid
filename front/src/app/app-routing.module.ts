import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroPageComponent } from './components/hero-page/hero-page.component';
import { AdminRoomComponent } from './components/admin-room/admin-room.component';
import { AdminHeroPageComponent } from './components/admin-room/admin-hero-page/admin-hero-page.component';
import { AdminPopUpComponent } from './components/admin-room/admin-pop-up/admin-pop-up.component';
import { RoomsComponent } from './components/rooms/rooms.component';

const routes: Routes = [
  {path: "", component: HeroPageComponent},
  {path: "auctions/:flightID/:userID", component: RoomsComponent},
  {path: "Admin/:flightID", component: AdminRoomComponent},
  {path: "Admin", component: AdminHeroPageComponent},
  {path: "RoomPage", component: RoomsComponent},
  /* {path: "AdminPopUp", component: AdminPopUpComponent} */
  {path: "AdminPopUp/:flightID", component: AdminPopUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
