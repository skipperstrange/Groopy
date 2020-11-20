import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import * as firebase from 'firebase';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from 'src/environments/validator';

@Component({
  selector: 'app-phoneregister',
  templateUrl: './phoneregister.page.html',
  styleUrls: ['./phoneregister.page.scss'],
})
export class PhoneregisterPage implements OnInit {

  windowReference:any;
  prefix:any;
  line:any;
  verifCode:any;
  name: any;
  username: any;
  img: any;

  constructor(private loginService: LoginService, private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    
}



}
