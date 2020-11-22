import {FirebaseMock} from "../firephonebrowsermock";
import { FirebaseX } from '@ionic-native/firebase-x/ngx';


export const isBrowser = (): boolean => {
  return (
    (document.URL.includes('https://') || document.URL.includes('http://localhost')) &&
    !document.URL.includes('/Application/')
  );
};

const FirebaseFactory = (): FirebaseX => {
  return isBrowser() ? new FirebaseMock() : new FirebaseX();
};
export const FirebaseProvider = {
  provide: FirebaseX,
  useFactory: FirebaseFactory,
};
