import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';

import './Layout.css';

// The code in this file was derived from the react-beautiful-dnd example code.

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    source: sourceClone,
    destination: destClone
  };
};

const Column = ({ columnId, columns, children, className, ...props }) => {

  const columnContents = columns[columnId];
  
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={classnames(snapshot.isDraggingOver ? 'active-drop' : '', className)}
          {...props}>
          {columnContents.map((item, index) => {

            const child = children.find(child => child.key === item.id);

            return (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={classnames('draggable', snapshot.isDragging ? 'active-drag' : '')}
                    style={provided.draggableProps.style}>
                    {child}
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

class Layout extends Component {

    constructor(props) {
      super(props);
      if (!props.initialState)
        throw new Error('Layout must be supplied initialState');
      this.state = props.initialState;
    }

    onDragEnd = result => {
      const { source, destination } = result;

      // dropped outside all valid columns
      if (!destination) {
        return;
      }

      // dropped into same column
      if (source.droppableId === destination.droppableId) {
        const items = reorder(
          this.state[source.droppableId],
          source.index,
          destination.index
        );

        this.setState((state={}) => Object.assign({}, state, {
          [source.droppableId]: items
        }));

      // dropped into different column
      } else {

        const result = move(
          this.state[source.droppableId],
          this.state[destination.droppableId],
          source,
          destination
        );

        this.setState((state={}) => Object.assign({}, state, {
          [source.droppableId]: result.source,
          [destination.droppableId]: result.destination
        }));
      }
    };


    render() {

      const { children } = this.props;

      const columnIds = Object.keys(this.state);
      columnIds.sort();

      const ncols = columnIds.length;

      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          {columnIds.map(columnId => (
            <Column
              key={columnId}
              columnId={columnId}
              columns={this.state}
              style={{ width: `${100/ncols - 2}%` }}>
              {children}
            </Column>
          ))}
        </DragDropContext>
      );
    }
}

export default Layout;
