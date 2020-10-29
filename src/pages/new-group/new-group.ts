import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoaderToasterProvider } from '../../providers/loader-toaster/loader-toaster';
import { GroupsProvider } from '../../providers/groups/groups';

/**
 * Generated class for the NewGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {

  newGroup = {
    groupPic:"../../assets/imgs/defaultUser.png",
    name: "",
    description: "",
    private: true,
    category: ""
  }

   groupForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, public loaderToaster: LoaderToasterProvider,
    public formBuilder: FormBuilder) {
    this.groupForm = formBuilder.group({
      name: ['name', Validators.compose([Validators.required, Validators.minLength(2)])]
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewGroupPage');
  }

  toggleGroupPrivacy(){
    this.newGroup.private = !this.newGroup.private
    console.log(this.newGroup.private)
  }

  save(){
      console.log(this.newGroup)
  }

  editImage(){

  }

}
