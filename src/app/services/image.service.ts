import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private profilePhotoOptions: CameraOptions = {
    quality: 50,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };

  private photoMessageOptions: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    allowEdit: true
  };

  private groupPhotoOptions: CameraOptions = {
    quality: 50,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };


  constructor(
    public angularfire: AngularFireDatabase,
    public loadingProvider: LoadingService,
    public camera: Camera,
    public mediaCapture: MediaCapture,
    public file: File) {
    console.log("Initializing Image Provider");
  }

  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  // Set ProfilePhoto given the user and the cameraSourceType.
  // This function processes the imageURI returned and uploads the file on Firebase,
  // Finally the user data on the database is updated.
  setProfilePhoto(user, sourceType) {
    console.log(user);
    this.profilePhotoOptions.sourceType = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera.getPicture(this.profilePhotoOptions).then((imageData) => {
      // Process the returned imageURI.
      let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
      let metadata = {
        'contentType': imgBlob.type
      };
      let name = this.generateFilename();
      let dpStorageRef = firebase.storage().ref().child('images/' + user.userId + '/' + name);
      // Generate filename and upload to Firebase Storage.
      dpStorageRef.put(imgBlob, metadata).then((snapshot) => {
        // Delete previous profile photo on Storage if it exists.
        // this.deleteImageFile(user.img);
        // URL of the uploaded image!
        console.log(snapshot);


        dpStorageRef.getDownloadURL().then(res => {
          console.log(res);
          let url = res;

          let profile = {
            displayName: user.name,
            photoURL: url
          };
          // Update Firebase User.
          firebase.auth().currentUser.updateProfile(profile)
            .then((success) => {
              // Update User Data on Database.
              this.angularfire.object('/accounts/' + user.userId).update({
                img: url
              }).then((success) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Profile Updated");
              }).catch((error) => {
                console.log(error);
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Something went wrong");
              });
            })
            .catch((error) => {
              console.log(error);
              this.loadingProvider.hide();
              this.loadingProvider.showToast("Something went wrong");
            });

        });



      }).catch((error) => {
        console.log(error);
        this.loadingProvider.hide();
        this.loadingProvider.showToast("Something went wrong");
      });
    }).catch((error) => {
      this.loadingProvider.hide();
    });
  }

  // Upload and set the group object's image.
  setGroupPhoto(group, sourceType) {
    this.groupPhotoOptions.sourceType = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
      // Process the returned imageURI.
      let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
      let metadata = {
        'contentType': imgBlob.type
      };

      let name = this.generateFilename();
      let groupStorageRef = firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + name);
      groupStorageRef.put(imgBlob, metadata).then((snapshot) => {
        // this.deleteImageFile(group.img);
        // URL of the uploaded image!
        groupStorageRef.getDownloadURL().then(url => {
          group.img = url;
          this.loadingProvider.hide();
        })

      }).catch((error) => {
        this.loadingProvider.hide();
        this.loadingProvider.showToast("Something went wrong");
      });
    }).catch((error) => {
      this.loadingProvider.hide();
    });
  }

  // Set group photo and return the group object as promise.
  setGroupPhotoPromise(group, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.groupPhotoOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        let gPPStorageRef = firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + this.generateFilename());
        gPPStorageRef.put(imgBlob, metadata).then((snapshot) => {
          this.deleteImageFile(group.img);
          // URL of the uploaded image!
          gPPStorageRef.getDownloadURL().then(url => {
            group.img = url;
            this.loadingProvider.hide();
            resolve(group);
          })

        }).catch((error) => {
          this.loadingProvider.hide();
          this.loadingProvider.showToast("Something went wrong");
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  //Delete the image given the url.
  deleteImageFile(path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + fileName).delete().then(() => { }).catch((error) => { console.log(error) });
  }

  //Delete the user.img given the user.
  deleteUserImageFile(user) {
    var fileName = user.img.substring(user.img.lastIndexOf('%2F') + 3, user.img.lastIndexOf('?'));
    firebase.storage().ref().child('images/' + user.userId + '/' + fileName).delete().then(() => { }).catch((error) => { console.log(error) });
  }

  // Delete group image file on group storage reference.
  deleteGroupImageFile(groupId, path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    firebase.storage().ref().child('images/' + groupId + '/' + fileName).delete().then(() => { }).catch((error) => { console.log(error) });
  }

  // Upload photo message and return the url as promise.
  uploadPhotoMessage(conversationId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        // Generate filename and upload to Firebase Storage.
        let upRef = firebase.storage().ref().child('images/' + conversationId + '/' + this.generateFilename());
        upRef.put(imgBlob, metadata).then((snapshot) => {
          // URL of the uploaded image!
          upRef.getDownloadURL().then(url => {
            this.loadingProvider.hide();
            resolve(url);
          })

        }).catch((error) => {
          this.loadingProvider.hide();
          this.loadingProvider.showToast("Something went wrong");
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Upload group photo message and return a promise as url.
  uploadGroupPhotoMessage(groupId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        // Generate filename and upload to Firebase Storage.
        let ugpRef = firebase.storage().ref().child('images/' + groupId + '/' + this.generateFilename());
        ugpRef.put(imgBlob, metadata).then((snapshot) => {
          // URL of the uploaded image!
          ugpRef.getDownloadURL().then(url => {
            this.loadingProvider.hide();
            resolve(url);
          })

        }).catch((error) => {
          this.loadingProvider.hide();
          this.loadingProvider.showToast("Something went wrong");
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }
  uploadGroupVideoMessage(groupId): Promise<any> {
    return new Promise(resolve => {
      this.loadingProvider.show();
      this.mediaCapture.captureVideo().then(data => {
        let videoUrl = data[0].fullPath;
        console.log("video path: " + videoUrl);
        let x = videoUrl.split("/");
        let filepath = videoUrl.substring(0, videoUrl.lastIndexOf("/"));
        let name = x[x.length - 1];
        console.log(filepath + " - " + name);
        this.file.readAsArrayBuffer(filepath, name).then(success => {
          console.log(success);
          let blob = new Blob([success], { type: "video/mp4" });
          console.log(blob);
          let upload = firebase.storage().ref().child('videos/' + groupId + "/" + name).put(blob);
          upload.then(res => {
            let process = res.bytesTransferred / res.totalBytes * 100;
            console.log(process);
            this.loadingProvider.hide();

            resolve(res.downloadURL);
          }, err => {
            this.loadingProvider.hide();
            console.log("Failed")
          });

        });
      }, err => {
        this.loadingProvider.hide();
        console.log("Media Err = " + err);
      });
    });
  }

  uploadVideoMessage(conversationId): Promise<any> {
    return new Promise(resolve => {
      this.loadingProvider.show();
      this.mediaCapture.captureVideo().then(data => {
        let videoUrl = data[0].fullPath;
        console.log("video path: " + videoUrl);
        let x = videoUrl.split("/");
        let filepath = videoUrl.substring(0, videoUrl.lastIndexOf("/"));
        let name = x[x.length - 1];
        console.log(filepath + " - " + name);
        this.file.readAsArrayBuffer(filepath, name).then(success => {
          console.log(success);
          let blob = new Blob([success], { type: "video/mp4" });
          console.log(blob);
          // let timestamp = (Math.floor(Date.now() / 1000)).toString();

          let uploadRef = firebase.storage().ref().child('videos/' + name);
          uploadRef.put(blob).then(res => {
            let process = res.bytesTransferred / res.totalBytes * 100;
            console.log(process);
            this.loadingProvider.hide();
            uploadRef.getDownloadURL().then(url => {
              resolve(url);
            })

          }, err => {
            this.loadingProvider.hide();
            console.log("Failed")
          });
        });
      }, err => {
        this.loadingProvider.hide();
        console.log("Media Err = " + err);
      });
    });
  }
}
