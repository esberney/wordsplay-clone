import { connect } from 'react-redux';
import { set, update, filter, pull, concat, compose } from 'lodash/fp';

import { highlightedIndices2 } from './match-finder.js';
import { isWordAsync } from './is-word-async.js';
import { Wordlist } from './Wordlist.js';

//
// ACTION CREATORS
//

export const updateCurrentGuess = guess => {
  return { type: 'UPDATE_GUESS', guess };
}

export const makeGuess = guess => (dispatch, getState) => {
  dispatch({ type: 'MAKE_GUESS', guess });
  const { board } = getState();
  const { wordsNeedingAsyncVerification } = board;
  wordsNeedingAsyncVerification.forEach(({ word, status }) => {
    if (status === 'not-started') {
      dispatch({ type: 'UPDATE_WORD_STATE', word, status: 'started' })
      isWordAsync(word).
      then(({ isWord, word }) => {
        dispatch({ type: 'UPDATE_WORD_STATE', word, status: 'finished', isWord });
      });
    }
  });
}

//
// CONNECTORS
//

export const connectBoard = connect(
  ({ board }) => board,
  dispatch => {
    return {
      actions: {
        updateCurrentGuess: guess => dispatch(updateCurrentGuess(guess)),
        makeGuess: guess => dispatch(makeGuess(guess))
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


export const createBoardReducer = () => {

  const defaultState = {
    word: '',
    wordlist: new Wordlist(),
    highlights: [],
    board: [
      ['A', 'B', 'C', 'H'],
      ['D', 'E', 'F', 'R'],
      ['G', 'H', 'I', 'Q'],
      ['Z', 'H', 'N', 'T']
    ],
    wordsNeedingAsyncVerification: []
  };

  return (state=defaultState, action) => {

    const { wordlist, board } = state;
    const { highlights, isActionableGuess } = searchBoard(board, action.guess);


    switch (action.type) {
      case 'UPDATE_GUESS':
        const updateGuess = compose(
          set('word', action.guess),
          set('highlights', highlights)
        );

        return updateGuess(state);

      case 'MAKE_GUESS':

        if (isActionableGuess) {
          const makeGuess = compose(
            set('word', ''),
            set('highlights', []),
            set('wordlist', wordlist.with(action.guess)),
            update('wordsNeedingAsyncVerification', list => list.concat([ { word: action.guess, status: 'not-started' } ]))
          );
          return makeGuess(state);
        } else {
          const makeBadGuess = compose(
            set('word', ''),
            set('highlights', [])
          );
          return makeBadGuess(state);
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
