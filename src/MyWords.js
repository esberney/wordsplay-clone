import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Card, ListGroup } from 'react-bootstrap';


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

export const MyWords = ({ words: wordlist, style, ...props }) => {
  return (
    <Card style={Object.assign({ width: '25%' }, style)} {...props}>
      <Card.Header>My Words</Card.Header>
      <ListGroup variant="flush">
        {
          wordlist.isEmpty() ? (
            <ListGroup.Item><em>Nothing here yet...</em></ListGroup.Item>
          ) : (
            wordlist.map((word, index) => (
              <ListGroup.Item key={index} variant={colorize(wordlist.status(word))}>{word}</ListGroup.Item>
            ))
          )
        }
      </ListGroup>
    </Card>
  );
}
