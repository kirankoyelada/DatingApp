import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { exhaustMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegiser = new EventEmitter();

  model: any = {};

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {}

  register(model: any) {
    this.authService.register(model).subscribe(
      () => {
        this.alertify.success('registration successfully');
      },
      (error) => this.alertify.error(error)
    );
  }

  cancel() {
    this.cancelRegiser.emit(false);
    console.log('canceled');
  }
}
