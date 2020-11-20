import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendsPage } from './friends.page';
import { SharedModule } from '../services/share.module';


const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FriendsPage
  ]
})
export class FriendsPageModule {}
