import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from 'src/environments/validator';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  email: any;
  password: any;
  myForm: FormGroup;
  submitAttempt = false;
  errorMessages: any = [];

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) {

    this.errorMessages = Validator.errorMessages
    this.myForm = this.formBuilder.group({
      email: Validator.emailValidator,
    })
  }

  ngOnInit() {
  }

  reset() {
    this.submitAttempt = true;
    if (this.myForm.controls.email.valid) {
      this.loginService.reset(this.email);
    }
  }

}
