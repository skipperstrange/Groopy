import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  loginWithFacebook() {
    this.loginService.fbLogin();
  }

  loginWithGoogle() {
    this.loginService.gLogin();
  }

  goToPhoneRegister(){
    this.router.navigateByUrl('/phoneregister');
  }

  goToEmailRegister(){
    this.router.navigateByUrl('/login');
  }

}
