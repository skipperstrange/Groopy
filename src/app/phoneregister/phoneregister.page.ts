import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from 'src/environments/validator';
import { LoadingService } from '../services/loading.service';


@Component({
  selector: 'app-phoneregister',
  templateUrl: './phoneregister.page.html',
  styleUrls: ['./phoneregister.page.scss'],
})
export class PhoneregisterPage implements OnInit {

  phoneNumber

  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(private loginService: LoginService, private formBuilder: FormBuilder,
              private router: Router, private alertCtrl: AlertController, private loadingProvider: LoadingService) { }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
  }

  ionViewWillEnter(){

}

registerWithPhone(phoneNumber: number){
  const appVerifier = this.recaptchaVerifier;
  const phoneNumberString = "+" + phoneNumber;
  this.loadingProvider.show();
  firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
  .then( async (confirmationResult) => {
    this.loadingProvider.hide();
    let prompt = await this.alertCtrl.create({
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
      buttons: [
        { text: 'Cancel',
          handler: data => { console.log('Canceled'); }
        },
        { text: 'Send Verification Code',
          handler: data => {
            confirmationResult
              .confirm(data.confirmationCode)
              .then(function (result) {
                // User signed in successfully.
                console.log(result.user);
                // ...
              })
              .catch(function (error) {
                // User couldn't sign in (bad verification code?)
                // ...
              });
          }
        }
      ]
    });
    prompt.title = 'Enter the Confirmation code';
    await prompt.present();
  })
  .catch(function (error) {
    this.loadingProvider.hide();
    console.error("SMS not sent", error);
  });

}



}
