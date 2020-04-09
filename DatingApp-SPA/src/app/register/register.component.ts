import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  @Output() cancelRegiser=new EventEmitter();

  model:any={};

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  register(model:any){
    this.authService.register(model).subscribe(()=>{
      console.log("registration successfully");
    },error=>console.log(error));
  }

  cancel(){
    this.cancelRegiser.emit(false);
    console.log("canceled")
  }


}
