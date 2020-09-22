import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePicPage } from './profile-pic';

@NgModule({
  declarations: [
    ProfilePicPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePicPage),
  ],
})
export class ProfilePicPageModule {}
