import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { set, update, filter, pull, concat, compose } from 'lodash/fp';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './Layout.js';
import { FlexCentered } from './FlexCentered.js';
import { Board } from './Board.js';
import { MyWords } from './MyWords.js'
import { Decorated } from './Decorated.js';
import { GuessBox } from './GuessBox.js';
import { MyFakeWords } from './items-creator.js';
import { GameCountdown } from './GameCountdown';
import { connectBoard, createBoardReducer } from './board-reducer.js';


class UnconnectedApp extends Component {

  render() {

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Layout initialState={{
            'column-0': [ { id: 'item-1' }, { id: 'item-2' }, { id: 'new-game-countdown' } ],
            'column-1': [ { id: 'the-board' }, { id: 'item-4' } ],
            'column-2': [ { id: 'entry' }, { id: 'your-words' } ]
          }}>

            <div key="the-board">
              <FlexCentered>
                <Board />
              </FlexCentered>
            </div>
            <GuessBox key="entry" style={{ width: '100%' }} />
            <MyWords key="your-words" style={{ width: '100% '}} />
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
const App = connectBoard(UnconnectedApp);

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
