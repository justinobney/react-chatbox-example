import React from 'react';

export default class SuggestionList extends React.Component {
  _renderSuggestion(item, idx){
    let {activeIdx, capture, renderSuggestion} = this.props;
    let className = idx == (activeIdx || 0) ? 'selected' : '';
    let key = capture.value.substring(0,1);
    return (
      <div className={`suggestion-item ${className}`}>
        {renderSuggestion(key, item)}
      </div>
    );
  }
  render(){
    let {items, open} = this.props;

    if(!open)
      return null;

    return (
      <div ref="autoComplete"
        className="autocomplete-menu">
        {items.map(::this._renderSuggestion)}
      </div>
    );
  }
}