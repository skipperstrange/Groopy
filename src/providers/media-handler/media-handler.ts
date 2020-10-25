import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { File } from "@ionic-native/file";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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
  cameraImageURI:any;
  cameraImageFileName:any;


  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }

  constructor(public fileHandler: File, public fileChooser: FileChooser, public filePath: FilePath,
    private transfer: FileTransfer,
    private camera: Camera,) {
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

  picMsgStore(){
    var promise = new Promise((resolve, reject) => {
      this.fileChooser.open().then((url) =>{
        (<any>window).FilePath.resolveNativePath(url, (result)=>{
          this.nativePath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) =>{
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], {type: 'image/jpeg'});
                var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg');
                imageStore.put(imgBlob).then((res: any) => {
                   this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg').getDownloadURL().then((url) =>{
                    resolve(url);
                  }).catch((err) =>{
                    reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
                }
              })
            })
          })
        })
      })
      return promise;
  }

  getCameraImage(){
    var promise = new Promise((resolve, reject)=>{
          this.camera.getPicture(this.options).then((imageData) => {
          this.cameraImageURI = imageData;
           resolve(imageData)
        })
        .catch((err)=>{
          reject (err)
        })
    })
    return promise
  }

  cameraImageStore(img){
    var promise = new Promise((resolve, reject)=>{
        this.nativePath =  img;
          (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) =>{
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], {type: 'image/jpeg'});
                var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg');
                imageStore.put(imgBlob).then((res: any) => {
                   this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg').getDownloadURL().then((url) =>{
                    resolve(true);
                  }).catch((err) =>{
                    reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
                }
              })
            })
    })
    return promise
  }



}
