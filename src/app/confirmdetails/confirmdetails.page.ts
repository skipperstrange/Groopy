import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, Platform } from '@ionic/angular';
import { ImageService } from '../services/image.service';
import { Camera } from '@ionic-native/camera/ngx';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from 'src/environments/validator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-confirmdetails',
  templateUrl: './confirmdetails.page.html',
  styleUrls: ['./confirmdetails.page.scss'],
})
export class ConfirmdetailsPage implements OnInit {


  showOnline = false;
  isPushEnabled: any = false;
  user: any = {};

  myForm: FormGroup;
  submitAttempt = false;
  errorMessages: any = [];

  constructor(
    private loginService: LoginService,
    private dataProvider: DataService,
    private loadingProvider: LoadingService,
    private afdb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private imageProvider: ImageService,
    private camera: Camera,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.errorMessages = Validator.errorMessages
    this.myForm = this.formBuilder.group({
      name: Validator.nameValidator,
      username: Validator.usernameValidator,
      bio: Validator.bioValidator
    })

  }

  ngOnInit(){

  }

  ionViewDidEnter() {

    this.afAuth.auth.onAuthStateChanged(u => {
      if (u != null) {
        this.loginService.getUserData(u.uid).subscribe((user: any) => {
          this.loginService.setUser({ uid: user.key, ...user.payload.val() });
          this.user = this.loginService.getUser();
        })
      }
    })
  }



  saveAndContinue() {
    this.submitAttempt = true;
    if (this.myForm.valid) {
    console.log("trying to save")
      this.loadingProvider.show();
      this.loginService.updateUser(this.user).then(() => {
        this.loadingProvider.hide();
        this.loadingProvider.showToast("Updated Successfully")
        localStorage.clear();
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigateByUrl('/');

      }).catch(err => {
        this.loadingProvider.showToast("Something went wrong");
        this.loadingProvider.hide();
      });
    }
  }



  setPhoto() {

    this.alertCtrl.create({
      header: 'Set Profile Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    }).then(r => r.present());
  }
}
