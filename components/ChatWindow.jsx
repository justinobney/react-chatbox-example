import React from 'react';
import Radium from 'radium';
import color from 'color';
import MessageThread from './MessageThread';
import MentionInput from './MentionInput';

class ChatWindow extends React.Component {
  static propTypes = {
    username: React.PropTypes.string.isRequired,
    conversation: React.PropTypes.object.isRequired,
    onNewMessage: React.PropTypes.func
  }
  _renderSuggestion(captureKey, match){
    return <div>{captureKey} - {match}</div>;
  }
  render() {
    let data = ['foo','bar','baz'];
    let {kind, onNewMessage} = this.props;
    let style = [ styles.base, styles[kind] ];

    return (
      <div style={style}>
        <div ref="chatHeader"
          style={styles.header}>
          {this.props.username}
        </div>
        <MessageThread ref="thread"
          messages={this.props.conversation.messages} />
        <MentionInput ref="mentionInput"
          renderSuggestion={this._renderSuggestion}
          data={data}
          onSubmit={onNewMessage}/>
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
  }
};

export default Radium(ChatWindow);
