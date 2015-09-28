import React from 'react';
import Radium from 'radium';
import SuggestionList from './SuggestionList';
import getCaretCoordinates from '../util/getCaretCoordinates';
import getCapture from '../util/findMentions';

class MentionInput extends React.Component {
  constructor(props){
    super(props);
    this.state={
      value: props.value || '',
      activeCapture: false,
      activeIdx: 0
    }
  }
  _getFilteredItems(){
    let {capture} = this.state;
    let {data, includeToken} = this.props;
    if(!capture)
      return [];

    let value = includeToken ? capture.value : capture.value.substring(1);
    return data.filter((item)=> !!value && item.startsWith(value)).slice(0,20);
  }
  _handleChange(e){
    let token = this.props.token ? [this.props.token] : null;
    let input = this.refs.messageInput.getDOMNode();
    let capture = getCapture(input.value, input.selectionEnd, token);
    let newState = {value: e.target.value};

    if(capture){
      let coordinates = getCaretCoordinates(input, input.selectionEnd);
      newState = {...newState, activeCapture: true, capture, coordinates, activeIdx:0};
    } else {
      newState = {...newState, activeCapture: false, capture:null, coordinates:null, activeIdx:0};
    }

    this.setState(newState);
  }
  _handleFormSubmit(e){
    e.preventDefault();

    this.props.onSubmit(this.state.value);
    this.setState({value: '', activeCapture: false, capture:null, coordinates:null});
  }
  _handleKeyDown(e){
    let keyMap = {
      27: 'ESC',
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN',
      13: 'ENTER',
       9: 'TAB'
    }

    if(e.shiftKey && e.which == 13){
      this._handleFormSubmit(e);
      return;
    }

    if(e.shiftKey || e.ctrlKey){
      return;
    }

    let {activeIdx, capture, value, activeCapture} = this.state;
    let key = keyMap[e.which];
    let items = this._getFilteredItems();

    if(!key || !activeCapture || !items.length)
      return;

    e.preventDefault();

    let actions = {
      'ESC': () => this.setState({activeCapture: false, capture:null, coordinates:null}),
      'LEFT': this._shiftActive.bind(this, -1),
      'UP': this._shiftActive.bind(this, -1),
      'RIGHT': this._shiftActive.bind(this, +1),
      'DOWN': this._shiftActive.bind(this, +1),
      'ENTER': ::this._replaceToken,
      'TAB': ::this._replaceToken
    }

    let action = actions[key];
    if(action){
      action.call(this);
    }
  }
  _replaceToken(){
    let {activeIdx, capture, value} = this.state;
    let chars = value.split('');
    let items = this._getFilteredItems();
    let selected = items[activeIdx];

    chars.splice(capture.left, capture.right, selected);
    this.setState({activeCapture:false, value: chars.join('')});
  }
  _shiftActive(offset){
    let {activeIdx} = this.state;
    let items = this._getFilteredItems();
    let maxIdx = items.length - 1;
    let next = Math.min(activeIdx + offset, maxIdx);
    let prev = Math.max(activeIdx + offset, 0);
    let idx = offset > 0 ? next : prev;
    this.setState({activeIdx: idx});
  }
  componentDidUpdate(prevProps, prevState) {
    let {activeCapture, coordinates} = this.state;

    if(activeCapture){
      let autoComplete = this.refs.suggestionList.refs.autoComplete.getDOMNode();
      let input = this.refs.messageInput.getDOMNode();

      autoComplete.style.bottom = `${input.offsetHeight - coordinates.top + 25}px`;
      autoComplete.style.right = `${input.offsetWidth - coordinates.left + 2}px`;
    }
  }
  render(){
    let {value, activeCapture, capture, activeIdx} = this.state;
    let {renderSuggestion} = this.props;
    let items = null;
    
    if(activeCapture){
      items = this._getFilteredItems();
    }

    let open = items && !!items.length

    return (
      <form style={styles.inputWrapper}
        onSubmit={::this._handleFormSubmit}>
        <textarea ref="messageInput"
          key="messageInput"
          value={value}
          style={styles.input}
          onChange={::this._handleChange}
          onKeyDown={::this._handleKeyDown}
          placeholder="Talk to me..."></textarea>
        <SuggestionList ref="suggestionList"
          open={open}
          items={items}
          activeIdx={activeIdx}
          capture={capture}
          renderSuggestion={renderSuggestion} />
        <button type="submit">Send</button>
      </form>
    );
  }
}

let styles = {
  inputWrapper: {
    position: 'relative'
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
    fontSize: '18px'
  }
};

export default Radium(MentionInput);