import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.scss'],
})
export class HeroPageComponent implements OnInit {
  constructor(
    private _flightService: FlightService,
    private _userService: UserService
  ) {}

  loginForm: FormGroup;
  log: boolean = false;
  name: string;
  email: string;

  ngOnInit(): void {
    this._flightService.getRandomFlight().subscribe((data) => {
      this._flightService.addFlight(data);
    });

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      fullname: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    this.email = this.loginForm.get('email').value;
    this.name = this.loginForm.get('fullname').value;
    this._userService.emailUser = this.email;
    this._userService.nameUser = this.name;
    this._userService
      .setUserData({
        email: this.email,
        name: this.name,
        flightID: this._flightService.flight?.flightID ?? 2,
      })
      .subscribe();
    this.log = true;
  }
}
