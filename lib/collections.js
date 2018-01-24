import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Notes = new Mongo.Collection('notes');

if(Meteor.isServer) {
  Meteor.publish('notes', function notesPublication(){
    return Notes.find({
      $or: [
        {private: {$ne: true}},
        {owner: this.userId}
      ]
    });
  });
}


Meteor.methods({
  'notes.insert'(noteText) {
    //noteText is a string
    check(noteText, String);

    //User is logged in
    if(! Meteor.userId()){
      throw new Meteor.Error('user not authorized');
    }

    timestamp = new Date();

    Notes.insert({
      text: noteText,
      createdAt: timestamp,
      niceTime: timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString(),
      user: Meteor.user().username,
      owner: Meteor.userId(),
      private: false,
      checked: false
    });
  },
  'notes.remove'(id) {
    check(id, String);

    const note = Notes.findOne(id);
    if (note.owner !== Meteor.userId()) {
      // make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Notes.remove(id);
  },
  'notes.setPrivate'(id, setToPrivate){
    check(id, String);
    check(setToPrivate, Boolean);

    const note = Notes.findOne(id);

    if(note.private && note.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Notes.update({_id: id}, { $set: {private: setToPrivate} });
  },
  'notes.setChecked'(id, setToChecked){
    check(id, String);
    check(setToChecked, Boolean);

    const note = Notes.findOne(id);

    if(note.private && note.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Notes.update({_id: id}, { $set: {checked: setToChecked} });

  }
});
