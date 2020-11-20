import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddmembersPage } from './addmembers.page';
import { SharedModule } from '../services/share.module';

const routes: Routes = [
  {
    path: '',
    component: AddmembersPage
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
  declarations: [AddmembersPage]
})
export class AddmembersPageModule { }
