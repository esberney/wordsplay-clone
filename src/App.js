import React, { Component } from 'react';
import styled from 'styled-components';
import { ListGroup } from 'react-bootstrap';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Dashboard from 'react-dazzle';
import 'react-dazzle/lib/style/style.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { highlightedIndices2 } from './match-finder.js';
import { FlexCentered } from './FlexCentered.js';
import { Grid } from './Grid.js';
import { TextEntry } from './TextEntry.js';
import { MyWords } from './MyWords.js'
import { Wordlist } from './Wordlist.js';
import { isWordAsync } from './is-word-async.js';

const MyFakeWords = ({ }) => (
  <MyWords words={new Wordlist} />
);

class MyThing extends Component {

  state = {
    widgets: {
      WordCounter: {
        type: MyFakeWords,
        title: 'Counter widget',
      },
      BlipBlop: {
        type: MyFakeWords,
        title: 'Blip Blop',
      }
    },
    layout: {
      rows: [
        {
          columns: [
            {
              className: 'col-md-6',
              widgets: [{key: 'WordCounter'}],
            },
            {
              className: 'col-md-6',
              widgets: [{key: 'BlipBlop'}],
            }
          ],
        }
      ],
    },
    editMode: true,
    isModalOpen: false
  }

  render() {
    return (
      <Dashboard 
        editable={true}
        widgets={this.state.widgets}
        layout={this.state.layout}
        />
    );
  }
}


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

    return (
      <div>
        <MyThing />
        <FlexCentered>
          <Grid letters2d={myLetters} highlights={highlights} />
        </FlexCentered>
        <FlexCentered style={{ marginTop: '50px', marginBottom: '50px' }}>
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
        </FlexCentered>
        <FlexCentered>
          <MyWords words={wordlist} />
        </FlexCentered>
      </div>
    );
  }
}

export default App;
