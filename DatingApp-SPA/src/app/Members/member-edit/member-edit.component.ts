import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/User.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('form') editForm: NgForm;

  user: User;

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event) {
    if (this.editForm.dirty) {
      $event.returnValue = false;
    }
  }

  constructor(
    private ar: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private as: AuthService
  ) {}

  ngOnInit() {
    this.ar.data.subscribe((data) => {
      this.user = data['user'];
    });
  }

  updateUser() {
    this.userService.updateUser(this.as.decodedToken.nameid,this.user).subscribe(x=>{
      this.alertify.success('Profile updated successfully');
      this.editForm.reset(this.user);
    },error=>this.alertify.error(error));

  }
}
