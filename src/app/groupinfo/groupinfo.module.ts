import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GroupinfoPage } from './groupinfo.page';
import { SharedModule } from '../services/share.module';

const routes: Routes = [
  {
    path: '',
    component: GroupinfoPage
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
  declarations: [GroupinfoPage]
})
export class GroupinfoPageModule { }
