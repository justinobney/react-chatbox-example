import React from 'react';
import Radium from 'radium';
import moment from 'moment';
import Autolinker  from 'autolinker';
import emojione from 'emojione';

class Message extends React.Component {
  _parseText(text){
    let linkedText = Autolinker.link(text);
    let emojiText = emojione.shortnameToImage(linkedText);
    return {
      __html: emojiText
    }
  }
  render() {
    let {message, showBorder, isTimeGrouped} = this.props;
    let messageBorder = showBorder ? styles.borderedMessage : null;
    let timestampStyle = isTimeGrouped ? styles.timestampMuted : null;
    let userStyle = [styles.user, {color: message.userColor}];
    let msgDate = moment(message.timestamp);
    let timestamp = msgDate.format('h:mm a'); 

    return (
      <div style={[styles.base, messageBorder]}>
        <span style={[styles.timestamp, timestampStyle]}>{timestamp}</span>
        <span style={userStyle}>{message.user}</span>
        <span dangerouslySetInnerHTML={this._parseText(message.text)} />
      </div>
    );
  }
}

let styles = {
  base: {
    position: 'relative',
    padding: '2px 5px 2px 80px'
  },
  borderedMessage: {
    borderTop: 'solid 1px #DDD',
  },
  user: {
    padding: '0 10px 0 0',
    fontWeight: '600',
    fontFamily: 'Consolas'
  },
  timestamp: {
    fontWeight: '600',
    fontFamily: 'Arial',
    position: 'absolute',
    left: '5px',
    display: 'inline-block',
    color: '#888'
  },
  timestampMuted: {
    fontWeight: '0',
    color: '#CCC'
  }
};

export default Radium(Message);
