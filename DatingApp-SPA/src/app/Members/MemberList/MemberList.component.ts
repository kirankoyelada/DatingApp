import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-MemberList',
  templateUrl: './MemberList.component.html',
  styleUrls: ['./MemberList.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagNav:Pagination;
  user:User=JSON.parse(localStorage.getItem('user'));
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}];
  userParams:any=[];

  constructor(
    private userService: UserService,
    private alterifyService: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.user);
    this.route.data.subscribe((data) => {
      this.users = data['users'].result;
      console.log('pagination data',data['users']);
      this.pagNav=data['users'].pagination;
    });
    this.userParams.gender=this.user.gender == 'female' ? 'male' : 'female';
    this.userParams.minAge=18;
    this.userParams.maxAge=99;
    this.userParams.orderBy='lastActive';
  }

  resetFilters(){
    this.userParams.gender=this.user.gender == 'female' ? 'male' : 'female';
    this.userParams.minAge=18;
    this.userParams.maxAge=99;
    this.loadUsers();
  }

  pageChagned(event:any):void{
    this.pagNav.currentPage=event.page;
    console.log(this.pagNav.currentPage);
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagNav.currentPage,this.pagNav.itemsPerPage,this.userParams)
        .subscribe((opt:PaginatedResult<User[]>)=>{
      this.users=opt.result;
      this.pagNav=opt.pagination;
    },error=>this.alterifyService.error=error);
  }
}
