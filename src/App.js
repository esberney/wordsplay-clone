import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { set, update, filter, pull, concat, compose } from 'lodash/fp';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

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
import { GameCountdown } from './GameCountdown';


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

const connectBoard = connect(
  ({ board }) => ({
    board
  }),
  dispatch => {
    return {
      actions: {
        updateCurrentGuess: guess => dispatch({ type: 'UPDATE_GUESS', guess }),
        makeGuess: guess => dispatch((dispatch, getState) => {
          dispatch({ type: 'MAKE_GUESS', guess });
          const { wordsNeedingAsyncVerification } = getState();
          wordsNeedingAsyncVerification.forEach(({ word, status }) => {
            if (status === 'not-started') {
              dispatch({ type: 'UPDATE_WORD_STATE', word, status: 'started' })
              isWordAsync(word).
              then(({ isWord, word }) => {
                dispatch({ type: 'UPDATE_WORD_STATE', word, status: 'finished', isWord });
              });
            }
          });
        }),
        updateGuessStatus: (guess, isWord) => dispatch((dispatch, getState) => {
          dispatch({ type: 'UPDATE_GUESS_STATUS', guess, isWord });
        })
      }
    };
  }
);



const searchBoard = (board, guess) => {
  const highlights = highlightedIndices2(board, guess);
  const isGuessOnBoard = highlights.length > 0;
  const isActionableGuess = guess && guess.length && isGuessOnBoard;

  return {
    highlights,
    isActionableGuess
  }
};


const createBoardReducer = () => {

  const defaultState = {
    word: '',
    wordlist: new Wordlist(),
    board: [
      ['A', 'B', 'C', 'H'],
      ['D', 'E', 'F', 'R'],
      ['G', 'H', 'I', 'Q'],
      ['Z', 'H', 'N', 'T']
    ],
    wordsNeedingAsyncVerification: []
  };

  return (state=defaultState, action) => {

    const { word, wordlist, board } = state;
    const { highlights, isActionableGuess } = searchBoard(board, action.guess);


    switch (action.type) {
      case 'UPDATE_GUESS':

        return set(
          'word', action.guess,
          set(
            'highlights', highlights, 
            state
          )
        );

      case 'MAKE_GUESS':

        if (isActionableGuess) {
          const makeGuess = compose(
            set('word', ''),
            set('wordlist', wordlist.with(action.guess)),
            update('wordsNeedingAsyncVerification', list => list.concat([ { word: action.guess, status: 'not-started' } ]))
          );
          return makeGuess(state);
        } else {
          return set('word', '', state);
        }

      case 'UPDATE_WORD_STATE':

        if (action.status === 'started') {
          return update(
            'wordsNeedingAsyncVerification',
            list => list.map(
              ({ word, status }) => {
                if (word === action.word)
                  return { word, status: action.status };
                else
                  return { word, status };
              }
            ),
            state
          );
        }

        if (action.status === 'finished') {
          wordlist.setStatus(action.word, action.isWord);
          const removeWord = compose(
            update('wordsNeedingAsyncVerification', filter(({ word }) => word !== action.word)),
            set('wordlist', wordlist)
          );

          return removeWord(state);
        }

      default:
        return state;
    }
  }
};

const store = createStore(
  combineReducers({
    board: createBoardReducer()
  }),
  applyMiddleware(
    thunkMiddleware,  // lets us dispatch() functions
    createLogger()
  )
);


export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
