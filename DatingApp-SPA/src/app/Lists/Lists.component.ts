import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-Lists',
  templateUrl: './Lists.component.html',
  styleUrls: ['./Lists.component.css'],
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likeParams: string;

  constructor(
    private ar: ActivatedRoute,
    private us: UserService,
    private alterify: AlertifyService,
    private as: AuthService
  ) {}

  ngOnInit() {
    this.ar.data.subscribe(x=>{
      console.log('user data',x['user']);
      this.users=x['user'].result;
      this.pagination=x['user'].pagination;
    });
    this.likeParams='Likers';
  }

  pageChagned(event:any):void{
    this.pagination.currentPage=event.page;
    console.log(this.pagination.currentPage);
    this.loadUsers();
  }

  loadUsers(){
    this.us.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage,null,this.likeParams)
        .subscribe((opt:PaginatedResult<User[]>)=>{
      this.users=opt.result;
      this.pagination=opt.pagination;
    },error=>this.alterify.error=error);
  }
}
