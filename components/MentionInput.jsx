import React from 'react';
import Radium from 'radium';
import getCaretCoordinates from '../util/getCaretCoordinates';
import getCapture from '../util/findMentions';

class MentionInput extends React.Component {
  constructor(props){
    super(props);
    this.state={
      value: props.value || '',
      activeCapture: false
    }
  }
  _handleChange(e){
    let input = this.refs.messageInput.getDOMNode();
    let autoComplete = this.refs.autoComplete.getDOMNode();
    let capture = getCapture(input.value, input.selectionEnd);
    let newState = {value: e.target.value};

    if(capture){
      let coordinates = getCaretCoordinates(input, input.selectionEnd);
      newState = {...newState, activeCapture: true, capture, coordinates};
    } else {
      newState = {...newState, activeCapture: false, capture:null, coordinates:null};
    }

    this.setState(newState);
  }
  _handleFormSubmit(e){
    e.preventDefault();

    let input = this.refs.messageInput.getDOMNode();
    let text = input.value;
    this.props.onSubmit(text);
    this.setState({value: '', activeCapture: false, capture:null, coordinates:null});
  }
  componentDidUpdate(prevProps, prevState) {
    let {activeCapture, coordinates} = this.state;
    if(activeCapture){
      let autoComplete = this.refs.autoComplete.getDOMNode();
      let input = this.refs.messageInput.getDOMNode();
      autoComplete.style.bottom = `${input.offsetHeight - coordinates.top + 5}px`;
      autoComplete.style.right = `${input.offsetWidth - coordinates.left + 5}px`;
    }
  }
  render(){
    let {value, activeCapture, capture, coordinates} = this.state;
    let {data, renderSuggestion} = this.props;
    let items = null;
    
    if(activeCapture){
      let key = capture.value.substring(0,1);
      let value = capture.value.substring(1);
      items = data
        .filter((item)=> !!value && item.startsWith(value))
        .map((item) => renderSuggestion(key, item));
    }

    activeCapture = items && !!items.length

    let autoCompleteStyle = {
      display: activeCapture ? 'block': 'none'
    };

    return (
      <form style={styles.inputWrapper}
        onSubmit={::this._handleFormSubmit}>
        <textarea 
          ref="messageInput"
          key="messageInput"
          value={value}
          onChange={::this._handleChange}
          style={styles.input}
          placeholder="Talk to me..."></textarea>
        <div
          ref="autoComplete"
          className="autocomplete-menu"
          style={autoCompleteStyle}>
          Items
          <br />
          {items}
        </div>
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
