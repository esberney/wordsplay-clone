import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { ListGroup } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { highlightedIndices2 } from './match-finder.js';
import { Grid } from './Grid.js';

const highlighted = [
  {
    rowIndex: 1,
    columnIndex: 2
  },  {
    rowIndex: 0,
    columnIndex: 1
  }
];

const myLetters = [
  ['A', 'B', 'C', 'H'],
  ['D', 'E', 'F', 'R'],
  ['G', 'H', 'I', 'Q'],
  ['Z', 'H', 'N', 'T']
];


class TextEntry extends Component {

  componentDidMount() {
    this.entry.focus();
  }

  render() {
    const { value, onChange, onEnter } = this.props;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
        <input
          ref={input => { this.entry = input; }}
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

const MyWords = ({ words: wordlist }) => {
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
  return (
    <ListGroup style={{ width: '25%', marginLeft: '38%' }}>
      {
        wordlist.map((word, index) => (
          <ListGroup.Item key={index} variant={colorize(wordlist.status(word))}>{word}</ListGroup.Item>
        ))
      }
    </ListGroup>
  );
}

class Wordlist {
  constructor() {
    this.set = new Set;
    this.ordered = [];
    this.validities = {};
  }
  add(entry) {
    if (false === this.set.has(entry)) {
      this.set.add(entry);
      const index = _.sortedIndex(this.ordered, entry);
      this.ordered.splice(index, 0, entry);

      this.validities[entry] = undefined; // not yet known
      return true; // added
    }
    
    return false; // not added
  }
  with(entry) {
    this.add(entry);
    return this;
  }
  map(f) {
    return this.ordered.map(f);
  }
  setStatus(entry, isOk) {
    this.validities[entry] = isOk;
  }
  status(entry) {
    // active, success, or danger result in blue, green, or red coloration
    return this.validities[entry];
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

            // not necessarily a word -- that takes time to verify
            const isAcceptable = isWordOnBoard && word.length;

            this.setState(({ wordlist }) => {
              return {
                word: '',
                wordlist: isAcceptable ? wordlist.with(word) : wordlist
              };
            });

            if (isAcceptable) {

              // check validity
              let isWord = new Promise((resolve, reject) => {
                setTimeout(() => resolve(true), 2000);
              });

              isWord.then(isWord => {
                this.setState(({ word: currentWord, wordlist }) => {
                  wordlist.setStatus(word, isWord);
                  return {
                    word: currentWord,
                    wordlist
                  };
                })
              });
            }
          }}
        />
        <MyWords words={wordlist} />
      </div>
    );
  }
}

export default App;
