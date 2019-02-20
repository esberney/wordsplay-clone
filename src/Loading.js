import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

const FlexContainer = styled.div`
  margin-top: -5%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
`;

export const Loading = ({}) => (
  <FlexContainer>
    <ReactLoading type="cubes" color="#e2e2e2" height="10%" width="10%" />
  </FlexContainer>
);