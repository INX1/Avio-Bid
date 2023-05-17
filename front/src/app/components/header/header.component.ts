import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  logedIn = false;
  emailTest: string = '';
  passTest: string = '';
  loginForm: FormGroup;

  constructor(private _userService: UserService, public router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  onSubmit() {
    this.emailTest = this.loginForm.get('email').value;
    this.passTest = this.loginForm.get('password').value;

    this._userService.emailAdmin === this.emailTest &&
    this._userService.passwAdmin === this.passTest
      ? this.router.navigate(['/Admin'])
      : null;
  }
}
