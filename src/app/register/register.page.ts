import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from 'src/environments/validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: any;
  username: any;
  email: any;
  password: any;
  img: any;

  myForm: FormGroup;
  submitAttempt = false;
  errorMessages: any = [];

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) {
    this.errorMessages = Validator.errorMessages
    this.myForm = this.formBuilder.group({
      name: Validator.nameValidator,
      username: Validator.usernameValidator,
      email: Validator.emailValidator,
      password: Validator.passwordValidator
    })
  }

  ngOnInit() {
  }

  register() {
    this.submitAttempt = true;
    if (this.myForm.valid) {
      this.loginService.register(this.name, this.username, this.email, this.password, this.img);
    }
    else {
      console.log("Invalid")
    }
  }
}
