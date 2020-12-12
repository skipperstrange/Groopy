import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { IonicModule } from '@ionic/angular';

import { PhoneregisterPage } from './phoneregister.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneregisterPage
  }
];

@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonIntlTelInputModule
  ],
  declarations: [PhoneregisterPage],
})
export class PhoneregisterPageModule {}
