import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Rx";
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the BuddiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {

  foundBuddies = []
  Buddies : any
  startAt = new Subject()
  endAt = new Subject()
  startAtObs = this.startAt.asObservable()
  endAtObs = this.endAt.asObservable()
  lastKeyPress = 0

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider) {
      this.userService.getAllUsers().then(res=>{
        this.Buddies =res
      });
      console.log(this.Buddies)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }

  ngOnInit(){

  }

  async search($event){

      let q = $event.target.value
      if(!q || q == ''){
        this.foundBuddies =[]
        return
      }
    if(($event.timeStamp - this.lastKeyPress) > 200){

      this.foundBuddies = this.Buddies.filter(buddy => {
        if(buddy && q){
        return (buddy.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1)
        }
      })

    }
    console.log(this.foundBuddies)
    this.lastKeyPress = $event.timeStamp
  }

}
