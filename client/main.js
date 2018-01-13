import { Template } from 'meteor/templating';
import { Notes } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';

// Accounts config
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

import './main.html';

Template.body.helpers({
  notes(){
    n = Notes.find({});
    return n;
  }
});

Template.note.events({
  'click .delete-note': function(){
    Notes.remove(this._id);
  }
});

Template.add.events({
  'submit .add-form': function(event, template){
    event.preventDefault();

    //Get input value
    const target = event.target;
    const textValue = target.newNote.value;

    timestamp = new Date();

    //Insert Note into collection
    Notes.insert({
      text: textValue,
      createdAt: timestamp,
      niceTime: timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString(),
      user: Meteor.user().username,
      owner: Meteor.userId()
    });

    //Clear the form
    target.newNote.value = "";

    //Close the modal
    $('#addNote').modal('close');

  }
});
