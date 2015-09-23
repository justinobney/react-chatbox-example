import React from 'react';
import Radium from 'radium';
import color from 'color';
import MessageThread from './MessageThread';

class ChatWindow extends React.Component {
  _handleFormSubmit(e){
    e.preventDefault();

    let input = this.refs.messageInput.getDOMNode();
    let text = input.value;
    this.props.onNewMessage(text);
    input.value = '';
  }
  render() {
    let style = [ styles.base, styles[this.props.kind] ];
    let headerStateStyle = Radium.getState(this.state, 'messageInput', ':focus') ? { background: '#488A32' } : null;

    return (
      <form ref="chatWindow" style={style}
        onSubmit={::this._handleFormSubmit}>
        <div ref="chatHeader"
          style={[styles.header, headerStateStyle]}>
          {this.props.username}
        </div>
        <MessageThread ref="thread" messages={this.props.conversation.messages} />
        <input ref="messageInput" key="messageInput" style={styles.input} placeholder="Talk to me..." />
      </form>
    );
  }
}

ChatWindow.propTypes = {
  username: React.PropTypes.string.isRequired,
  conversation: React.PropTypes.object.isRequired,
  onNewMessage: React.PropTypes.func
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
