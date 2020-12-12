import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingService } from '../services/loading.service';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-phoneregister',
  templateUrl: './phoneregister.page.html',
  styleUrls: ['./phoneregister.page.scss'],
})
export class PhoneregisterPage implements OnInit {

  phoneNumber;
  input;
  iti: any;

  formValue = {phoneNumber: '', test: ''};
  myForm: FormGroup;

  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(private loginService: LoginService, private formBuilder: FormBuilder,
              private router: Router, private alertCtrl: AlertController,
              private loadingProvider: LoadingService, private dataService: DataService) {
               }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    this.myForm = new FormGroup({
      phoneNumber: new FormControl({
        value: this.formValue.phoneNumber
      })
    });

  }

  ionViewWillEnter(){


 }

registerWithPhone(){
  const appVerifier = this.recaptchaVerifier;
  const phoneNumberString =this.phoneNumber.internationalNumber;
  if (this.myForm.valid) {
    this.loginService.phoneNumberLogin(phoneNumberString, appVerifier);
  }

}



}
