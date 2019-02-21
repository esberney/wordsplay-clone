import React, { Component } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

export const MyFakeWords = ({ title, ...props }) => {
  return (
    <Card {...props}>
      <Card.Header>{title}</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item><em>Nothing here yet...</em></ListGroup.Item>
      </ListGroup>
    </Card>
  );
}


// fake data generator
export const getItems1 = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: (
      <MyFakeWords title={`item ${k + offset}`} style={{ width: '100%' }} />
    )
  }));

export const createGetItems = () => {
  let counter = 0;
  return count => {
    const items = getItems1(count, counter);
    counter += count;
    return items;
  }
};

// some sample stuff

const getItems = createGetItems();

export const createState = (nRows) => {
  return Array.from({ length: nRows }, (v, k) => k).
  reduce((state, k) => Object.assign(state, {
    [`column-${k}`]: []
  }), {});
};

export const populateColumns = state => {
  let i = 0;
  const stateOut = {};
  for (let columnId of Object.keys(state)) {
    stateOut[columnId] = getItems(++i);
  }
  return stateOut;
};

// eg, <Layout initialState={populateColumns(createState(3))} />