import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';

const Table = styled.table`
  box-sizing: border-box;
  border: 5px solid red;
`;

const Td = styled.td`
  border: 3px solid black;
`;

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello I'm a title</h1>
        <Table>
          <tr>
            <Td>A</Td>
            <Td>B</Td>
            <Td>C</Td>
          </tr>
          <tr>
            <Td>D</Td>
            <Td>E</Td>
            <Td>F</Td>
          </tr>
          <tr>
            <Td>G</Td>
            <Td>H</Td>
            <Td>I</Td>
          </tr>
        </Table>
      </div>
    );
  }
}

export default App;
