import React, { Component } from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { highlightedIndices2 } from './match-finder.js';
import { Grid } from './Grid.js';
import { TextEntry } from './TextEntry.js';
import { MyWords } from './MyWords.js'
import { Wordlist } from './Wordlist.js';
import { isWordAsync } from './is-word-async.js';

const myLetters = [
  ['A', 'B', 'C', 'H'],
  ['D', 'E', 'F', 'R'],
  ['G', 'H', 'I', 'Q'],
  ['Z', 'H', 'N', 'T']
];

const Centered = ({ children, style={} }) => {
  return (
    <div
      style={Object.assign({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
       }, style)}>
      {children}
    </div>
  );
}

const isWordPossible = (word, isWordOnBoard) => {
  // not necessarily a word -- that takes time to verify
  const isAcceptable = word && word.length && isWordOnBoard;
  return isAcceptable;
};

const createUpdateWordlist = (word, isAcceptable) => wordlist => {

  if (isAcceptable)
    return wordlist.with(word);
  else
    return wordlist;  // no change
};


class App extends Component {

  state = {
    word: '',
    wordlist: new Wordlist()
  }

  onGuess(isWordOnBoard) {
    const { word } = this.state;

    const isAcceptable = isWordPossible(word, isWordOnBoard);
    const updateWordlist = createUpdateWordlist(word, isAcceptable);

    this.setState(({ wordlist }) => {
      return {
        word: '',
        wordlist: updateWordlist(wordlist)
      };
    });

    if (isAcceptable) {

      // check validity
      isWordAsync(word).
      then(({ isWord, word }) => {
        this.setState(({ word: currentWord, wordlist }) => {
          wordlist.setStatus(word, isWord);
          return {
            word: currentWord,
            wordlist
          };
        })
      });
    }
  }

  render() {

    const { word, wordlist } = this.state;
    const highlights = highlightedIndices2(myLetters, word);
    const isWordOnBoard = highlights.length > 0;

    return (
      <div>
        <Centered>
          <Grid letters2d={myLetters} highlights={highlights} />
        </Centered>
        <Centered style={{ marginTop: '50px', marginBottom: '50px' }}>
          <TextEntry
            value={word}
            onChange={value => {
              this.setState(({ wordlist }) => ({
                word: value,
                wordlist
              }))
            }} 
            onEnter={() => this.onGuess(isWordOnBoard) }
          />
        </Centered>
        <Centered>
          <MyWords words={wordlist} />
        </Centered>
      </div>
    );
  }
}

export default App;
