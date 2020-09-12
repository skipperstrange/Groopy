import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { userCreds } from "../../models/interfaces/usercreds";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public aFireAuth : AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  login(userCredentials: userCreds){
    var promise = new Promise((resolve, reject) => {
      this.aFireAuth.auth.signInWithEmailAndPassword(userCredentials.email, userCredentials.password)
      .then(()=>{
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      })
    });
    return promise
  }

}
