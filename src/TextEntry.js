import React, { Component } from 'react';

export class TextEntry extends Component {
  componentDidMount() {
    this.entry.focus();
  }
  render() {
    const { value, onChange, onEnter } = this.props;
    return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
      <input ref={input => { this.entry = input; }} value={value} onChange={event => {
        const { value } = event.target;
        onChange(value);
      }} onKeyPress={e => {
        if (e.key === 'Enter') {
          onEnter();
        }
      }}>
      </input>
    </div>);
  }
}
