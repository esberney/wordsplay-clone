import React, { Component } from 'react';

import { Loading } from './Loading.js';

class AppLoading extends Component {

  state = {
    Component: Loading
  }

  componentDidMount() {
    Promise.all([
      import('./App.js').then(({ default: App }) => App),
      new Promise(resolve => { setTimeout(resolve, 2200); }) // 2200 is the time for 1 animation cycle
    ]).
    then(([ App ]) => {
      this.setState({
        Component: App
      });
    }).
    catch(err => {
      debugger;
    });
  }

  render() {
    const { Component } = this.state;

    return (
      <Component />
    );
  }
}

export default AppLoading