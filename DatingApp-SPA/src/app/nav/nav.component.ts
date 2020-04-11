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
  constructor(
    private authService: AuthService,
    private alterify: AlertifyService,
    private router:Router
  ) {}

  ngOnInit() {}

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
    this.alterify.success('user logged out successfull');
    this.router.navigate(['/home']);
  }
}
