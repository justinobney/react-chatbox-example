import React from 'react';
import Radium from 'radium';
import firebase from 'firebase';
import ChatWindow from './ChatWindow';

let fbRef = new Firebase('https://slackfire.firebaseio.com/');

export default class ChatWindowContainer extends React.Component {
  state = { conversation: { messages: [] } }
  _handleNewMessage(text){
    let timestamp = Firebase.ServerValue.TIMESTAMP;
    let user = { user: this.props.username };
    let msg = Object.assign({}, user, {text, timestamp});
    fbRef.child('messages').push(msg);
  }
  _getInitialMessage(ref){
    ref.once('value', (value_snapshot) => {
      let val = value_snapshot.val();
      if(val){
        let existing = Object.keys(val).map((key=>val[key]))
        this.setState({
          conversation: { messages: [...existing] }
        });
      }
    });
  }
  _listenFormNewMessages(ref){
    ref.limitToLast(1).once('value', (value_snapshot) => {
      let val = value_snapshot.val();
      let first = false;

      if(val){
        let key = Object.keys(val)[0];
        let last = val[key];
        ref = ref.startAt(last.timestamp);
        first = true
      }

      ref.on('child_added', (added_snapshot) => {
        if (first) {
          first = false;
          return;
        }

        let convo = this.state.conversation;
        this.setState({conversation: {messages: [...convo.messages, added_snapshot.val()]}});
      });
    });
  }
  componentDidMount() {
    let messageRef = fbRef.child('messages').orderByChild('timestamp');

    this._getInitialMessage(messageRef);
    this._listenFormNewMessages(messageRef);
  }
  render(){
    return (
      <ChatWindow
        username={this.props.username}
        conversation={this.state.conversation}
        onNewMessage={::this._handleNewMessage} />
    );
  }
}