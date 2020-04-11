import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    private authService: AuthService,
    private alterify: AlertifyService
  ) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.model).subscribe(
      (res) => this.alterify.success('logged in success'),
      (error) => this.alterify.error(error)
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
    
  }

  logout() {
    localStorage.removeItem('token');
    this.alterify.success('user logged out successfull');
  }
}
