import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase
  ) { }


  // Get all users
  getUsers() {
    // return this.afdb.list('/accounts', ref => ref.orderByChild('name'));
  }

  searchUser(keyword) {
    return this.afdb.list('/accounts', ref => ref.orderByChild('name').startAt(keyword).endAt(keyword + "\uf8ff"));
  }

  // Get user with username
  getUserWithUsername(username) {
    return this.afdb.list('/accounts', ref => ref.orderByChild('username').equalTo(username));
  }

  // Get logged in user data
  getCurrentUser() {
    return this.afdb.object('/accounts/' + this.afAuth.auth.currentUser.uid);
  }

  // Get user by their userId
  getUser(userId) {
    return this.afdb.object('/accounts/' + userId);
  }

  // Get requests given the userId.
  getRequests(userId) {
    return this.afdb.object('/requests/' + userId);
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.afdb.list('/requests', ref => ref.orderByChild('receiver').equalTo(userId));
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.afdb.object('/conversations/' + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.afdb.list('/accounts/' + this.afAuth.auth.currentUser.uid + '/conversations');
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.afdb.object('/conversations/' + conversationId + '/messages');
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.afdb.object('/groups/' + groupId + '/messages');
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.afdb.list('/accounts/' + this.afAuth.auth.currentUser.uid + '/groups');
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.afdb.object('/groups/' + groupId);
  }

  getBlockedLists() {
    return this.afdb.list('/accounts/' + this.afAuth.auth.currentUser.uid + '/conversations', ref => ref.orderByChild('blocked').equalTo(true));
  }
}
