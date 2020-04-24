import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-MemberCard',
  templateUrl: './MemberCard.component.html',
  styleUrls: ['./MemberCard.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(
    private as: AuthService,
    private us: UserService,
    private alterity: AlertifyService
  ) {}

  ngOnInit() {
    
  }

  sendLike(id:number){
    this.us.sendlike(this.as.decodedToken.nameid,id).subscribe(x=>{
      this.alterity.success("You have liked: "+this.user.knownAs);
    },error=>this.alterity.error(error));
  }
}
