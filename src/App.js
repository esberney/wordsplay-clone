import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import MyThing from './DndThing.js';

import 'bootstrap/dist/css/bootstrap.min.css';

import { highlightedIndices2 } from './match-finder.js';
import { FlexCentered } from './FlexCentered.js';
import { Grid } from './Grid.js';
import { TextEntry } from './TextEntry.js';
import { MyWords } from './MyWords.js'
import { Wordlist } from './Wordlist.js';
import { isWordAsync } from './is-word-async.js';
import { createGetItems } from './items-creator.js';
import { Decorated } from './Decorated.js';


const getItems = createGetItems();

const myLetters = [
  ['A', 'B', 'C', 'H'],
  ['D', 'E', 'F', 'R'],
  ['G', 'H', 'I', 'Q'],
  ['Z', 'H', 'N', 'T']
];

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

    const Board = ({ }) => {
      return (
        <div>
          <FlexCentered>
            <Grid letters2d={myLetters} highlights={highlights} />
          </FlexCentered>
          <FlexCentered style={{ marginTop: '50px', marginBottom: '50px' }}>
            <Decorated title="Guess">
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
            </Decorated>
          </FlexCentered>
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <MyThing initialState={{
            'column-0': getItems(3),
            'column-1': [
              {
                id: 'the-board',
                content: (
                  <Board />
                )
              },
              ...getItems(1)
            ],
            'column-2': [
              {
                id: 'your-words',
                content: (
                  <MyWords words={wordlist} style={{ width: '100%' }} />
                )
              }
            ]
          }} />
        </div>
        <Board />
      </div>
    );
  }
}

export default App;
