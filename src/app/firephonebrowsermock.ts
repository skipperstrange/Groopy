import { FirebaseX } from '@ionic-native/firebase-x/ngx';

export class FirebaseMock extends FirebaseX {

  verifyPhoneNumber(): Promise<any> {
    return Promise.resolve({verificationId: 'example'})
  }
}

