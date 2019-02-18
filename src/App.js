import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';

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
  border: 3px solid black;
  background-color: lightgreen;
  font-size: 70px;
  width: 100px;
  height: 100px;
  text-align: center;
`;

const highlighted = [
  {
    rowIndex: 1,
    columnIndex: 2
  },  {
    rowIndex: 0,
    columnIndex: 1
  }
];

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
            <GreenCell>{letter}</GreenCell>
          ) : (
            <Cell>{letter}</Cell>
          )
        ))
      }
    </tr>
  )
}

const Grid = ({ letters2d, highlights }) => {
  return (
    <Table>
      {
        letters2d.map((letters, index) => (
          <Row letters={letters} rowIndex={index} highlights={highlights} />
        ))
      }
    </Table>
  )
};

const myLetters = [
  ['A', 'B', 'C', 'H'],
  ['D', 'E', 'F', 'R'],
  ['G', 'H', 'I', 'Q'],
  ['Z', 'H', 'N', 'T']
];


// produces a list of (row, column) indices for highlighting
const highlightedIndices = (grid, word) => {
  const highlighted = [];
  for (let character of word) {
    for (let row = 0; row < grid.length; row++) {
      for (let column = 0; column < grid[row].length; column++) {
        if (grid[row][column].toUpperCase() === character.toUpperCase()) {
          highlighted.push({
            rowIndex: row,
            columnIndex: column
          });
        }
      }
    }
  }

  return highlighted;
}

const TextEntry = ({ onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
      <input onChange={event => onChange(event.target.value)}></input>
    </div>
  );
};


class App extends Component {

  state = {
    myWord: ''
  }

  render() {

    const { myWord } = this.state;
    const highlights = highlightedIndices(myLetters, myWord);


    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid letters2d={myLetters} highlights={highlights} />
        </div>
        <TextEntry onChange={value => {
          this.setState({
            myWord: value
          })
        }} />
      </div>
    );
  }
}

export default App;
