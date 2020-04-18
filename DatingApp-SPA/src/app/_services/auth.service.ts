import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/User';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:5000/Auth/';
  currentUser:User;
  jwtHelper = new JwtHelperService();
  decodedToken:any;
  photoUrl=new BehaviorSubject<string>("../../assets/user.png");
  currentPhoto=this.photoUrl.asObservable();
  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.currentUser=user;
          localStorage.setItem('token', user.token);
          localStorage.setItem('imageUrl',user.userInfo);
          this.decodedToken=this.jwtHelper.decodeToken(user.token);
          this.currentUser=user.userInfo;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'Register', model);
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  changeMemberPhoto(photoUrl:string){
    this.photoUrl.next(photoUrl);
  }
}
