import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page?,itemsPerPage?,userParams?): Observable<PaginatedResult<User[]>> {

    const paginatedResults:PaginatedResult<User[]>=new PaginatedResult<User[]>();

    let httpParams=new HttpParams();

    if(page!=null && itemsPerPage!=null){
      httpParams=httpParams.append('pageNumber',page);
      httpParams=httpParams.append('pageSize',itemsPerPage);
    }

    if(userParams!=null){
      httpParams=httpParams.append('minAge',userParams.minAge);
      httpParams=httpParams.append('maxAge',userParams.maxAge);
      httpParams=httpParams.append('gender',userParams.gender);
      httpParams=httpParams.append('orderBy',userParams.orderBy);
    }
    return this.http.get<User[]>(this.baseUrl + 'users',{observe:'response',params: httpParams  }).pipe(
      map(response=>{
        console.log('response',response);
        paginatedResults.result=response.body;
        if(response.headers.get('Pagination')!=null){
          paginatedResults.pagination=JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResults;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id:number,user:User){
    return this.http.put(this.baseUrl+'users/'+id,user);
  }

  setMainPhoto(userId:number, id:number){
    //http://localhost:5000/api/users/6/photos/20/setMain 
    return this.http.post(this.baseUrl+ "users/"+userId+"/photos/"+id+"/setMain",{});
  }

  deletePhoto(userId:number,id:number){
    return this.http.delete(this.baseUrl+ "users/"+userId+"/photos/"+id); 
  }
}
