import React, { Component } from 'react';

export class TextEntry extends Component {

  componentDidMount() {
    this.entry.focus();
  }
  render() {
    const { value, onChange, onEnter } = this.props;
    return (<div>
      <input
        style={{ width: '100%' }}
        ref={input => { this.entry = input; }}
        value={value}
        onChange={event => {
          const { value } = event.target;
          onChange(value);
        }}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            onEnter();
          }
        }} />
    </div>);
  }
}