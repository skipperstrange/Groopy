import { Component, OnInit } from '@angular/core';
import {ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.page.html',
  styleUrls: ['./imagemodal.page.scss'],
})
export class ImagemodalPage implements OnInit {
  img
  constructor(private modal: ModalController) { }

  ngOnInit() {
    console.log(this.img);
  }

  close() {
    this.modal.dismiss();
  }

}
