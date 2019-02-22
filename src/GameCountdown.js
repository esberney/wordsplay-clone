import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export const minutes = totalSeconds => Math.floor(totalSeconds / 60);
export const seconds = totalSeconds => {
  const s = totalSeconds % 60;
  return (s < 10) ? `0${s}` : `${s}`;
};

export class GameCountdown extends Component {

  gameTime = 3 * 60;
  state = {
    intervalTimer: undefined,
    timeLeft: 3 * 60
  };

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
    return (<Card style={{ width: '100%' }}>
      <Card.Header>New game begins in...</Card.Header>
      <Card.Body style={{ fontSize: 33, padding: 0, marginLeft: '8%' }}>
        {`${minutes(timeLeft)}:${seconds(timeLeft)}`}
      </Card.Body>
    </Card>);
  }
}
