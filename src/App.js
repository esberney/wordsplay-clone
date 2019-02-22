import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { Card } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './Layout.js';
import { highlightedIndices2 } from './match-finder.js';
import { FlexCentered } from './FlexCentered.js';
import { Grid } from './Grid.js';
import { TextEntry } from './TextEntry.js';
import { MyWords } from './MyWords.js'
import { Wordlist } from './Wordlist.js';
import { isWordAsync } from './is-word-async.js';
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
          <Layout initialState={{
            'column-0': [ { id: 'item-1' }, { id: 'item-2' }, { id: 'new-game-countdown' } ],
            'column-1': [ { id: 'the-board' }, { id: 'item-4' } ],
            'column-2': [ { id: 'entry' }, { id: 'your-words' } ]
          }}>
            <Board key="the-board" />
            <Entry key="entry" style={{ width: '100%' }} />
            <MyWords key="your-words" words={wordlist} style={{ width: '100% '}} />
            <GameCountdown key="new-game-countdown" />
            <MyFakeWords key="item-1" title="Item 1" />
            <MyFakeWords key="item-2" title="Item 2" />
            <MyFakeWords key="item-3" title="Item 3" />
            <MyFakeWords key="item-4" title="Item 4" />
          </Layout>
        </div>
      </div>
    );
  }
}

const minutes = totalSeconds => Math.floor(totalSeconds / 60);
const seconds = totalSeconds => {
  const s = totalSeconds % 60;
  return (s < 10) ? `0${s}` : `${s}`;
};

class GameCountdown extends Component {

  gameTime = 3 * 60
  state = {
    intervalTimer: undefined,
    timeLeft: 3 * 60
  }

  componentDidMount() {
    const intervalTimer = setInterval(() => {
      this.setState(state => {
        const { timeLeft } = state;
        return Object.assign({}, state, {
          timeLeft: timeLeft <= 0 ? 0 : (timeLeft - 1)
        });
      });
    }, 1000);

    this.setState(state => Object.assign({}, state, {
      intervalTimer
    }));
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalTimer);
  }

  render() {

    const { timeLeft } = this.state;

    return (
      <Card style={{ width: '100%' }}>
        <Card.Header>New game begins in...</Card.Header>
        <Card.Body style={{ fontSize: 33, padding: 0, marginLeft: '8%' }}>
          {`${minutes(timeLeft)}:${seconds(timeLeft)}`}
        </Card.Body>
      </Card>
    );
  }
}

export default App;
