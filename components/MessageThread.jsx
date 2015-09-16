import React from 'react';
import Radium from 'radium';
import moment from 'moment';
import Please from 'pleasejs';

let messages = [
  {text: 'hi', date: '9-15-2015 : 8:07 AM', user: 'joe', isYou: true},
  {text: 'hello', date: '9-15-2015 : 8:34 AM', user: 'sharon', isYou: false},
  {text: 'sorry.. got busy', date: '9-16-2015 : 10:14 AM', user: 'joe', isYou: true},
  {text: 'umm...', date: '9-16-2015 : 10:15 AM', user: 'joe', isYou: true},
  {text: 'this is a really long message where i try to explain why I have been ignoring you', date: '9-16-2015 : 11:52 AM', user: 'sharon', isYou: false},
];

let colorMap = {};

class MessageThread extends React.Component {
  _getUserColor(user){
    let color = colorMap[user];
    if (color) {
      return color
    } else {
      colorMap[user] = Please.make_color();
      return colorMap[user];
    }
  }
  _renderMessage(msg, idx, col){
    let prevMsg = col[Math.max(idx - 1, 0)];
    let msgDate = moment(msg.date);
    let prevMsgDate = moment(prevMsg.date);
    let userStyle = [styles.user, {color: this._getUserColor(msg.user)}];
    let timeAgo = msgDate.format('h:mm a'); 
    
    let isDifferentDate = prevMsgDate.format('YYYYMMDD') !== msgDate.format('YYYYMMDD');
    let dateSeperator = isDifferentDate ? this._renderDayDivider(prevMsgDate) : null;

    let isDifferentUser = prevMsg.user !== msg.user;
    let messageBorder = isDifferentUser && !isDifferentDate ? styles.borderedMessage : null;

    return (
      <div>
        {dateSeperator}
        <div style={[styles.message, messageBorder]}>
          <span style={styles.timestamp}>{timeAgo}</span>
          <span style={userStyle}>{msg.user}</span>
          <span>{msg.text}</span>
        </div>
      </div>
    );
  }
  _renderDayDivider(prevMsgDate){
    return (
      <div style={styles.dayDivider}>
        <hr style={styles.dayDividerHr}/>
        <span style={styles.dayDividerLabel}>
          {prevMsgDate.format('MMM Do')}
        </span>
      </div>
    );
  }
  render() {
    return (
      <div style={styles.base}>
        {messages.map(::this._renderMessage)}
      </div>
    );
  }
}

let styles = {
  base: {
    height: '350px'
  },
  message: {
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
  dayDivider: {
    margin: '0rem -18px 0rem -1.5rem',
    padding: '.5rem 18px .5rem 1.5rem',
    position: 'relative',
    textAlign: 'center',
    fontFamily: 'Consolas'
  },
  dayDividerHr: {
    position: 'absolute',
    borderTop: '1px solid #DDD',
    top: '1.1rem',
    right: '18px',
    left: '1.5rem',
    margin: '0'
  },
  dayDividerLabel: {
    padding: '0 1rem',
    position: 'relative',
    backgroundColor: '#fff'
  },
  timestamp: {
    fontWeight: '600',
    fontFamily: 'Arial',
    position: 'absolute',
    left: '5px',
    display: 'inline-block',
    color: '#888'
  }
};

export default Radium(MessageThread);
