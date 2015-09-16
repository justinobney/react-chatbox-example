import React from 'react';
import Radium from 'radium';
import color from 'color';
import MessageThread from './MessageThread';

class ChatWindow extends React.Component {
  render() {
    let style = [
      styles.base,
      styles[this.props.kind]
    ];

    var headerState = Radium.getState(this.state, 'messageInput', ':focus') ? { background: '#333' } : null;

    return (
      <div style={style}>
        <div style={[styles.header, headerState]}>Header</div>
        <MessageThread />
        <input key="messageInput" style={styles.input} placeholder="Talk to me..." />
      </div>
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
    border: 'none',
    borderTop: 'solid 1px #888',
    lineHeight: '30px',
    padding: '5px',
    fontSize: '18px',
    ':focus': {}
  }
};

export default Radium(ChatWindow);
