import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
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
        born: '02 mar 1999'
        }
    ];

    constructor(private http: HttpClient) { }

    public setUserData(data: any){
        return this.http.post('https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/users', data);
    }

    public getUserData(): Observable<any>{
        return this.http.get('https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/users/');
    }
}
