import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppLoading from './AppLoading';
import App from './App';
import * as serviceWorker from './serviceWorker';

// todo -- swap
ReactDOM.render(<AppLoading />, document.getElementById('root'));
//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
