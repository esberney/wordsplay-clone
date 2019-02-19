import React, { Component } from 'react';

export const FlexCentered = ({ children, style={} }) => {
  return (
    <div
      style={Object.assign({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
       }, style)}>
      {children}
    </div>
  );
}
