import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Notes = new Mongo.Collection('notes');

if(Meteor.isServer) {
  Meteor.publish('notes', function notesPublication(){
    return Notes.find();
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
      private: true
    });
  },
  'notes.remove'(id) {
    check(id, String);

    Notes.remove(id);
  },
  'notes.setPrivate'(id, setToPrivate){
    check(id, String);
    check(setToPrivate, Boolean);

    const note = Notes.findOne(id);

    if(note.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Notes.update({_id: id}, { $set: {private: setToPrivate} });
  }
});
