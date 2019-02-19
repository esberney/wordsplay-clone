import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';


const Table = styled.table`
  box-sizing: border-box;
  border: 3px solid black;
`;

const Cell = styled.td`
  border: 2px solid black;
  font-size: 70px;
  width: 100px;
  height: 100px;
  text-align: center;
`;

const GreenCell = styled.td`
  border: 2px solid black;
  background-color: lightgreen;
  font-size: 70px;
  width: 100px;
  height: 100px;
  text-align: center;
`;

const matches = (rIndex, cIndex, highlighted) => {
  return highlighted.some(({ rowIndex, columnIndex }) => {
    return rowIndex === rIndex
        && columnIndex === cIndex
  });
};

const Row = ({ letters, rowIndex, highlights }) => {
  return (
    <tr>
      {
        letters.map((letter, columnIndex) => (
          (matches(rowIndex, columnIndex, highlights)) ?
          (
            <GreenCell key={columnIndex}>{letter}</GreenCell>
          ) : (
            <Cell key={columnIndex}>{letter}</Cell>
          )
        ))
      }
    </tr>
  )
}

export const Grid = ({ letters2d, highlights }) => {
  return (
    <Table>
      <tbody>
        {
          letters2d.map((letters, index) => (
            <Row key={index} letters={letters} rowIndex={index} highlights={highlights} />
          ))
        }
      </tbody>
    </Table>
  )
};