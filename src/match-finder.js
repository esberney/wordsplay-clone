import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const letterMatches = (a, b) => {
  return a.toUpperCase() === b.toUpperCase();
}

const searchWholeGrid = (grid, letter) => {
  const matches = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (letterMatches(grid[row][column], letter)) {
        matches.push({
          rowIndex: row,
          columnIndex: column
        });
      }
    }
  }
  return matches;
};

const searchAdjacent = (indices, grid, letter) => {
  const rowMax = grid.length - 1,
        colMax = grid[0].length - 1;

  const reference = indices[indices.length - 1];

  const matches = [];
  for (let row = reference.rowIndex - 1; row <= reference.rowIndex + 1; row++) {
    for (let col = reference.columnIndex - 1; col <= reference.columnIndex + 1; col++) {

      // can't walk off the bounds of the grid
      if (row < 0 || row > rowMax || col < 0 || col > colMax)
        continue;

      // skip the center (reference index)
      if (row === reference.rowIndex && col === reference.columnIndex)
        continue;

      // can't use previously used letters
      const prior = indices.findIndex(({ rowIndex, columnIndex }) => {
        return rowIndex === row && columnIndex === col;
      });
      if (prior !== -1)
        continue;

      // otherwise, we only have to test for a match
      if (letterMatches(grid[row][col], letter)) {
        matches.push({
          rowIndex: row,
          columnIndex: col
        });
      }
    }
  }
  return matches;
};

export const highlightedIndices2 = (grid, word) => {
  
  const findIt = (str, indices=[]) => {
    
    // base case -- nothing to find

    if (!str || (str instanceof Array && str.length === 0)) {
      return {
        ok: true,
        paths: []
      };
    }

    // divide and conquer

    const [ letter, ...rest ] = str;

    // search the constrained solution space
    
    let matches = (indices.length === 0)
                ? searchWholeGrid(grid, letter)  // this is the first letter of the word, so we need to search every square
                : searchAdjacent(indices, grid, letter);
    
    const results = [];
    let thisOk = false;
    for (let match of matches) {
      const { ok, paths } = findIt(rest, indices.concat([match]));
      if (ok) {
        thisOk = true;

        // for penultimate call
        if (paths.length === 0) {
          const result = indices.concat([match]);
          results.push(result);
        }

        for (let path of paths) {
          const result = indices.concat([match]).concat(path);
          results.push(result);
        }
      }
    }
    return {
      ok: thisOk,
      paths: results
    };
  };

  const { paths } = findIt(word);
  return paths.reduce((result, path) => result.concat(path), []);
}

// v1 -- produces a list of (row, column) indices for highlighting
export const highlightedIndices = (grid, word) => {
  const highlighted = [];
  for (let character of word) {
    for (let row = 0; row < grid.length; row++) {
      for (let column = 0; column < grid[row].length; column++) {
        if (grid[row][column].toUpperCase() === character.toUpperCase()) {
          highlighted.push({
            rowIndex: row,
            columnIndex: column
          });
        }
      }
    }
  }

  return highlighted;
}
