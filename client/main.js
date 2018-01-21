import { Template } from 'meteor/templating';
import { Notes } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';

// Accounts config
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

import './main.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('notes');
});

Template.body.helpers({
  notes(){
    n = Notes.find({});
    return n;
  }
});

Template.note.events({
  'click .delete-note': function(){
    Meteor.call('notes.remove', this._id);
  },
  'click .toggle-private': function() {
    //console.log("set private true");
    Meteor.call('notes.setPrivate', this._id, !this.private);
  },
  'click .toggle-public': function() {
    //console.log('set private false');
    Meteor.call('notes.setPrivate', this._id, !this.private);
  }
});

Template.note.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  }
})

Template.add.events({
  'submit .add-form': function(event, template){
    event.preventDefault();

    //Get input value
    const target = event.target;
    const textValue = target.newNote.value;



    //Insert Note into collection
    Meteor.call('notes.insert', textValue);

    //Clear the form
    target.newNote.value = "";

    //Close the modal
    $('#addNote').modal('close');

  }
});
