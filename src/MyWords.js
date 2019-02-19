import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { ListGroup } from 'react-bootstrap';


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

export const MyWords = ({ words: wordlist }) => {
  return (
    <ListGroup style={{ width: '25%' }}>
      {
        wordlist.map((word, index) => (
          <ListGroup.Item key={index} variant={colorize(wordlist.status(word))}>{word}</ListGroup.Item>
        ))
      }
    </ListGroup>
  );
}
