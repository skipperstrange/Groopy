import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { File } from "@ionic-native/file";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
/*
  Generated class for the MediaHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaHandlerProvider {

  nativePath: any;
  firestore = firebase.storage()
  mediaSource: any
  mediaTypes = ['video/mp4','image/jpeg']
  constructor(public fileHandler: File, public fileChooser: FileChooser, public filePath: FilePath) {
    //console.log('Hello MediaHandlerProvider Provider');
  }


  uploadImage(){

    var promise = new Promise((resolve, reject) =>{
      this.fileChooser.open()
      .then(url => {
        debugger;
        console.log(url);
        (<any>window).FilePath.resolveNativeeFilePath(url, (result)=>{
          this.nativePath = result
          (<any>window).resolveLocalSystemUrl(this.nativePath, (res)=>{
            res.file((resFile)=>{
              var reader = new FileReader()
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) =>{
                var mediaBlob = new Blob([evt.target.result], {type: 'image/jpeg'})
                var mediaStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                mediaStore.put(mediaBlob).then((res)=>{
                 this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL()
                 .then((url)=>{
                   resolve(url)
                 })
                 .catch((err) =>{
                   reject(err)
                 })
                }).catch((err)=>{
                  reject(err)
                })
              }
            })
          })
        })
      })
    })
  return promise;
  }

}
