import React, { Component } from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { highlightedIndices2 } from './match-finder.js';
import { Grid } from './Grid.js';
import { TextEntry } from './TextEntry.js';
import { MyWords } from './MyWords.js'
import { Wordlist } from './Wordlist.js';

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
