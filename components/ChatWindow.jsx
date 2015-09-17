import React from 'react';
import Radium from 'radium';
import color from 'color';
import moment from 'moment';
import firebase from 'firebase';
import MessageThread from './MessageThread';

let fbRef = new Firebase("https://slackfire.firebaseio.com/");

let conversation = {
  messages: []
};

class ChatWindow extends React.Component {
  constructor(props){
    super(props);
    this.state = {conversation, open: true};
    this.user = { user: this.props.username, isYou: true };
  }
  _handleFormSubmit(e){
    e.preventDefault();
    let input = this.refs.messageInput.getDOMNode();
    let text = input.value;
    let timestamp = Firebase.ServerValue.TIMESTAMP;
    let msg = Object.assign({}, this.user, {text, timestamp});
    fbRef.child("messages").push(msg);
    input.value = '';
  }
  _toggleWindow(){
    let open = !this.state.open;
    this.setState({open});
  }
  componentDidMount() {
    let messageRef = fbRef.child("messages").orderByChild("timestamp");

    messageRef.once('value', (value_snapshot) => {
      let val = value_snapshot.val();
      var existing = Object.keys(val).map((key=>val[key]))
      this.setState({
        conversation: {
          messages: [...existing]
        }
      });
    });

    messageRef.limitToLast(1).once('value', (value_snapshot) => {
      let val = value_snapshot.val();
      let key = Object.keys(val)[0];
      let last = val[key];

      let first = true;
      messageRef.startAt(last.timestamp).on('child_added', (added_snapshot) => {
        if (first)
          first = false;
        else {
          let convo = this.state.conversation;
          this.setState({conversation: {messages: [...convo.messages, added_snapshot.val()]}});
        }
      });
    });
  }
  componentDidUpdate(){
    let {chatWindow, chatHeader} = this.refs;

    if (chatWindow && chatHeader) {
      let {open} = this.state;
      let heightStyle
      let windowHeight = chatWindow.getDOMNode().offsetHeight;
      let headerHeight = chatHeader.getDOMNode().offsetHeight;
      let bottom = (-1 * (windowHeight - headerHeight)) + 'px';
      heightStyle = !open ? bottom : 0;
      chatWindow.getDOMNode().style.bottom = heightStyle;
    }
  }
  render() {
    let style = [
      styles.base,
      styles[this.props.kind]
    ];

    let headerStateStyle = Radium.getState(this.state, 'messageInput', ':focus') ? { background: '#333' } : null;

    return (
      <form ref="chatWindow" style={style}
        onSubmit={::this._handleFormSubmit}>
        <div ref="chatHeader"
          style={[styles.header, headerStateStyle]}
          onClick={::this._toggleWindow}>
          {this.props.username}
        </div>
        <MessageThread ref="thread" conversation={this.state.conversation} />
        <input ref="messageInput" key="messageInput" style={styles.input} placeholder="Talk to me..." />
      </form>
    );
  }
}

let styles = {
  base: {
    border: 'solid 1px #000',
    width: '350px',
    position: 'fixed',
    right: '10px',
    bottom: '0'
  },
  primary: {
    background: '#0074D9'
  },
  header: {
    color: '#fff',
    background: color('#333').lighten(0.6).hexString(),
    height: '30px',
    lineHeight: '30px',
    padding: '5px'
  },
  input: {
    display: 'block',
    width: '340px',
    borderRight: 'none',
    borderLeft: 'none',
    borderBottom: 'none',
    borderTop: 'solid 1px #888',
    lineHeight: '30px',
    padding: '5px',
    fontSize: '18px',
    ':focus': {}
  }
};

export default Radium(ChatWindow);
