import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-blockedlist',
  templateUrl: './blockedlist.page.html',
  styleUrls: ['./blockedlist.page.scss'],
})
export class BlockedlistPage implements OnInit {

  blockedList: any = [];

  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
    private dataProvider: DataService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.dataProvider.getBlockedLists().snapshotChanges().subscribe(conversations => {
      let tmp = [];
      conversations.forEach(conversation => {
        // fetch blocked conversation & user info
        this.dataProvider.getUser(conversation.key).snapshotChanges().subscribe((data: any) => {
          tmp.push({ key: conversation.key, name: data.payload.val().name, img: data.payload.val().img });
        });

      })
      console.log(tmp);
      this.blockedList = tmp;
    });
  }

  unblock(uid) {
    console.log(uid);
    this.afdb.object('accounts/' + this.afAuth.auth.currentUser.uid + '/conversations/' + uid).update({
      blocked: false
    })
  }

}
