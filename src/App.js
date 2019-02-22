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
import { connectBoard, createBoardReducer } from './board-reducer.js';


class App extends Component {

  render() {

    const { word, wordlist, highlights, board, actions } = this.props;

    const Board = ({ }) => {
      return (
        <div>
          <FlexCentered>
            <Grid letters2d={board} highlights={highlights} />
          </FlexCentered>
        </div>
      );
    };

    const Entry = ({ ...props }) => {
      return (
        <Decorated title="Guess" {...props}>
          <TextEntry
            value={word}
            onChange={value => actions.updateCurrentGuess(value)} 
            onEnter={() => actions.makeGuess(word)}
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

const App2 = connectBoard(App);

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
    <App2 />
  </Provider>
)
