import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';


import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { LoginPage  } from '../pages/login/login';

import { LoginPageModule  } from '../pages/login/login.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ProfilePicPageModule } from '../pages/profile-pic/profile-pic.module';
import { GroupsPageModule } from '../pages/groups/groups.module';
import { ChatsPageModule } from '../pages/chats/chats.module';
import { PasswordResetPageModule } from '../pages/password-reset/password-reset.module';


import { firebaseConfig } from "./app.firebaseconfig";

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';


// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { MediaHandlerProvider } from '../providers/media-handler/media-handler';
import { RequestProvider } from '../providers/request/request';

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
AngularFireModule.initializeApp(firebaseConfig),
  AngularFireDatabaseModule,
  AngularFireAuthModule,
  ChatsPageModule,
  GroupsPageModule,
  ProfilePageModule,
  PasswordResetPageModule,
  ProfilePicPageModule,
  BrowserModule,
  LoginPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UserProvider,
    MediaHandlerProvider,
    RequestProvider,
  ]
})
export class AppModule {}
