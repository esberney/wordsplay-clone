import React from 'react';
import ReacTdOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReacTdOM.render(<App />, div);
  ReacTdOM.unmounTdomponentAtNode(div);
});
