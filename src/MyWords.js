import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Card, ListGroup } from 'react-bootstrap';

import { connectBoard } from './board-reducer.js';


const colorize = status => {
  switch (status) {
    case true:
      return 'success';
    case false:
      return 'danger';
    case undefined:
    default:
      return 'info';
  }
}

export const UnconnectedMyWords = ({ wordlist, style, ...props }) => {
  const length = wordlist.length();

  // todo -- bold good words
  // todo -- villa:2 score
  // Guesses (Score: 0)

  return (
    <Card style={Object.assign({ width: '25%' }, style)} {...props}>
      <Card.Header>My Words</Card.Header>
      <Card.Body>
        {
          wordlist.isEmpty() ? (
            <em>Nothing here yet...</em>
          ) : (
            wordlist.map((word, index) => (
              <span
                key={index}
                className={`text-${colorize(wordlist.status(word))}`}>
                {word + ((length - index > 1) ? ', '  : '')}
              </span>
            ))
          )
        }

      </Card.Body>
    </Card>
  );
};

export const MyWords = connectBoard(UnconnectedMyWords);
