import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  emailUser: string = '';
  nameUser: string = '';

  // Admin LogIn
  emailAdmin: string = 'admin@gmail.com';
  passwAdmin: string = 'admin1234';
  user = [
    {
      name: 'Marko Djordjevic',
      born: '02 mar 1999',
    },
  ];

  constructor(private http: HttpClient) {}

  public setUserData(data: any) {
    return this.http.post('http://localhost:8080/api/users', data, {
      responseType: 'text',
    });
  }
}
