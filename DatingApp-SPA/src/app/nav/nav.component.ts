import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl:string;
  constructor(
    public authService: AuthService,
    private alterify: AlertifyService,
    private router:Router
  ) {}

  ngOnInit() {
    this.authService.photoUrl.subscribe(p=>{
      this.photoUrl=p;
    })
  }

  login() {
    this.authService.login(this.model).subscribe(
      (res) => this.alterify.success('logged in success'),
      (error) => this.alterify.error(error),
      ()=>{
        this.router.navigate(['/members'])
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
    
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken=null;
    this.authService.currentUser=null;
    this.alterify.success('user logged out successfull');
    this.router.navigate(['/home']);
  }
}
