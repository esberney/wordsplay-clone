import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import _ from 'lodash';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <GreenCell key={columnIndex}>{letter}</GreenCell>
          ) : (
            <Cell key={columnIndex}>{letter}</Cell>
          )
        ))
      }
    </tr>
  )
}

const Grid = ({ letters2d, highlights }) => {
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

const myLetters = [
  ['A', 'B', 'C', 'H'],
  ['D', 'E', 'F', 'R'],
  ['G', 'H', 'I', 'Q'],
  ['Z', 'H', 'N', 'T']
];


// v1 -- produces a list of (row, column) indices for highlighting
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

const letterMatches = (a, b) => {
  return a.toUpperCase() === b.toUpperCase();
}

const searchWholeGrid = (grid, letter) => {
  const matches = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (letterMatches(grid[row][column], letter)) {
        matches.push({
          rowIndex: row,
          columnIndex: column
        });
      }
    }
  }
  return matches;
};

const searchAdjacent = (indices, grid, letter) => {
  const rowMax = grid.length - 1,
        colMax = grid[0].length - 1;

  const reference = indices[indices.length - 1];

  const matches = [];
  for (let row = reference.rowIndex - 1; row <= reference.rowIndex + 1; row++) {
    for (let col = reference.columnIndex - 1; col <= reference.columnIndex + 1; col++) {

      // can't walk off the bounds of the grid
      if (row < 0 || row > rowMax || col < 0 || col > colMax)
        continue;

      // skip the center (reference index)
      if (row === reference.rowIndex && col === reference.columnIndex)
        continue;

      // can't use previously used letters
      const prior = indices.findIndex(({ rowIndex, columnIndex }) => {
        return rowIndex === row && columnIndex === col;
      });
      if (prior !== -1)
        continue;

      // otherwise, we only have to test for a match
      if (letterMatches(grid[row][col], letter)) {
        matches.push({
          rowIndex: row,
          columnIndex: col
        });
      }
    }
  }
  return matches;
};

const highlightedIndices2 = (grid, word) => {
  
  const findIt = (str, indices=[]) => {
    
    // base case -- nothing to find

    if (!str || (str instanceof Array && str.length === 0)) {
      return {
        ok: true,
        paths: []
      };
    }

    // divide and conquer

    const [ letter, ...rest ] = str;

    // search the constrained solution space
    
    let matches = (indices.length === 0)
                ? searchWholeGrid(grid, letter)  // this is the first letter of the word, so we need to search every square
                : searchAdjacent(indices, grid, letter);
    
    const results = [];
    let thisOk = false;
    for (let match of matches) {
      const { ok, paths } = findIt(rest, indices.concat([match]));
      if (ok) {
        thisOk = true;

        // for penultimate call
        if (paths.length === 0) {
          const result = indices.concat([match]);
          results.push(result);
        }

        for (let path of paths) {
          const result = indices.concat([match]).concat(path);
          results.push(result);
        }
      }
    }
    return {
      ok: thisOk,
      paths: results
    };
  };

  const { paths } = findIt(word);
  return paths.reduce((result, path) => result.concat(path), []);
}

class TextEntry extends Component {

  render() {
    const { value, onChange, onEnter } = this.props;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
        <input
          value={value}
          onChange={event => {
            const { value } = event.target;
            onChange(value);
          }}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              onEnter();
            }
          }}>
        </input>
      </div>
    );
  }
};

const MyWords = ({ words }) => {
  return (
    <ListGroup style={{ width: '25%', marginLeft: '38%' }}>
      {
        words.map((word, index) => (
          <ListGroup.Item key={index}>{word}</ListGroup.Item>
        ))
      }
    </ListGroup>
  );
}

class Wordlist {
  constructor() {
    this.set = new Set;
    this.ordered = [];
  }
  add(entry) {
    if (false === this.set.has(entry)) {
      this.set.add(entry);
      const index = _.sortedIndex(this.ordered, entry);
      this.ordered.splice(index, 0, entry);
    }
  }
  with(entry) {
    this.add(entry);
    return this;
  }
  map(f) {
    return this.ordered.map(f);
  }
}

class App extends Component {

  state = {
    word: '',
    wordlist: new Wordlist()
  }

  render() {

    const { word, wordlist } = this.state;
    const highlights = highlightedIndices2(myLetters, word);
    const isWordOnBoard = highlights.length > 0;


    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid letters2d={myLetters} highlights={highlights} />
        </div>
        <TextEntry
          value={word}
          onChange={value => {
            this.setState(({ wordlist }) => ({
              word: value,
              wordlist
            }))
          }} 
          onEnter={() => {

            // check if ok (on the board and also a word)
            // clear the input (always)
            // add to word list (when ok)
            this.setState(({ word, wordlist }) => {
              return {
                word: '',
                wordlist: isWordOnBoard ? wordlist.with(word) : wordlist
              };
            });
          }}
        />
        <MyWords words={wordlist} />
      </div>
    );
  }
}

export default App;
