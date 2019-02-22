import React, { Component, Fragment } from 'react';

import { connectBoard } from './board-reducer.js';
import { Decorated } from './Decorated.js';
import { TextEntry } from './TextEntry.js';

export const GuessBox = connectBoard(({ word, actions, ...props }) => (
  <Decorated title="Guess" {...props}>
    <TextEntry
      value={word}
      onChange={value => actions.updateCurrentGuess(value)} 
      onEnter={() => actions.makeGuess(word)}
    />
  </Decorated>
));
