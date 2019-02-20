import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export const Decorated = ({ title, children, ...props }) => {
  return (
    <Card {...props}>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
}
