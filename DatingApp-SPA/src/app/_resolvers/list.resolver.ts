import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  likeParam = 'Likers';

  constructor(
    private router:Router,
    private us: UserService,
    private as: AuthService,
    private alterify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.us.getUsers(this.pageNumber,this.pageSize,null,this.likeParam).pipe(
        catchError((error) => {
            this.alterify.error('Problem retriveing data');
            this.router.navigate(['/home']);
            return of(null);
          })
    );
  }
}
