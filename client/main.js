import { Template } from 'meteor/templating';
import { Notes } from '../lib/collections.js';

import './main.html';

Template.body.helpers({
  notes(){
    return Notes.find({});
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

    //Insert Note into collection
    Notes.insert({
      text: textValue,
      createdAt: new Date(),
      user: 01
    });

    //Clear the form
    target.newNote.value = "";

    //Close the modal
    $('#addNote').modal('close');

  }
});
