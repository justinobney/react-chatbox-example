import React from 'react';
import Radium from 'radium';
import moment from 'moment';
import Please from 'pleasejs';
import Message from './Message';

let colorMap = {};

class MessageThread extends React.Component {
  static propTypes = {
    messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  }
  _getUserColor(user){
    let color = colorMap[user];
    if (color) {
      return color
    } else {
      colorMap[user] = Please.make_color()[0];
      return colorMap[user];
    }
  }
  _renderMessage(msg, idx, col){
    let lastIdx = idx - 1;
    let prevMsg = col[Math.max(lastIdx, 0)];
    let msgDate = moment(msg.timestamp);
    let prevMsgDate = moment(prevMsg.timestamp);

    let isDifferentDate = prevMsgDate.format('YYYYMMDD') !== msgDate.format('YYYYMMDD');
    let dateSeperator = isDifferentDate ? this._renderDayDivider(prevMsgDate) : null;
    let isDifferentUser = prevMsg.user !== msg.user;
    let isMessageTimeGrouped = lastIdx > -1 && msgDate.diff(prevMsgDate, 'minutes') < 3;

    msg.userColor = this._getUserColor(msg.user);

    return (
      <div key={msg.timestamp}>
        {dateSeperator}
        <Message message={msg}
          showBorder={isDifferentUser && !isDifferentDate}
          isTimeGrouped={isMessageTimeGrouped} />
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
  componentWillUpdate() {
    let node = this.refs.body.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }
  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      let node = this.refs.body.getDOMNode();
      node.scrollTop = node.scrollHeight
    }
  }
  render() {
    let {messages} = this.props;
    return (
      <div ref="body" style={styles.base}>
        {messages.map(::this._renderMessage)}
      </div>
    );
  }
}

let styles = {
  base: {
    height: '350px',
    overflowY: 'scroll',
    overflowX: 'hidden'
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
    borderTop: '1px solid #F88',
    top: '1.1rem',
    right: '18px',
    left: '1.5rem',
    margin: '0'
  },
  dayDividerLabel: {
    padding: '0 1rem',
    position: 'relative',
    backgroundColor: '#fff'
  }
};

export default Radium(MessageThread);
