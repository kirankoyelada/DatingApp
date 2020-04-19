import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { exhaustMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegiser = new EventEmitter();
  registerForm:FormGroup;
  user:User;
  bsConfig:Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb:FormBuilder,
    private router:Router
  ) {}

  ngOnInit() {
    this.bsConfig={
      containerClass: 'theme-red'
    },
   this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm=this.fb.group({
      userName:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(14)]],
      confirmPassword:['',Validators.required],
      gender:['male'],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required]
    },{validators:this.customValidator});
  }

  customValidator(g:FormGroup){
    return g.get('password').value == g.get('confirmPassword').value ? null : {'mismatch':true};
  }

  register() {
    if(this.registerForm.valid){
      this.user=Object.assign( {},this.registerForm.value);
      this.authService.register(this.user).subscribe(x=>{
        this.alertify.success('Registration Successfully');
      },error=>this.alertify.error(error),()=>{
        this.authService.login(this.user).subscribe(()=>{
          this.router.navigate(['/members']);
        })
      });
    }
  }

  cancel() {
    this.cancelRegiser.emit(false);
    console.log('canceled');
  }
}
