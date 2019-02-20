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
import { MyFakeWords } from './items-creator.js';


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
        </div>
      );
    };

    const Entry = ({ ...props }) => {
      return (
        <Decorated title="Guess" {...props}>
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
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <MyThing initialState={{
            'column-0': [ { id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' } ],
            'column-1': [ { id: 'the-board' }, { id: 'item-4' } ],
            'column-2': [ { id: 'entry' }, { id: 'your-words' } ]
          }}>
            <Board key="the-board" />
            <Entry key="entry" style={{ width: '100%' }} />
            <MyWords key="your-words" style={{ width: '100% '}} />
            <MyFakeWords key="item-1" title="Item 1" />
            <MyFakeWords key="item-2" title="Item 2" />
            <MyFakeWords key="item-3" title="Item 3" />
            <MyFakeWords key="item-4" title="Item 4" />
          </MyThing>
        </div>
        <Board />
        <FlexCentered style={{ marginTop: '50px', marginBottom: '50px' }}>
          <Entry />
        </FlexCentered>
      </div>
    );
  }
}

export default App;
