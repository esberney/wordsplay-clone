import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, ListGroup } from 'react-bootstrap';

export const MyFakeWords = ({ title, ...props }) => {
  return (
    <Card {...props}>
      <Card.Header>{title}</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item><em>Nothing here yet...</em></ListGroup.Item>
      </ListGroup>
    </Card>
  );
}


// fake data generator
const getItems1 = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

const createGetItems = () => {
  let counter = 0;
  return count => {
    const items = getItems1(count, counter);
    counter += count;
    return items;
  }
};
const getItems = createGetItems();

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  //background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  //width: 250
});

const nrows = 4;
const createState = (nRows) => {
  return Array.from({ length: nRows }, (v, k) => k).
  reduce((state, k) => Object.assign(state, {
    [`column-${k}`]: []
  }), {});
};

const populateColumns = state => {
  let i = 0;
  const stateOut = {};
  for (let columnId of Object.keys(state)) {
    stateOut[columnId] = getItems(++i);
  }
  return stateOut;
};

const Column = ({ columnId, columns }) => {

  const columnContents = columns[columnId];
  
  return (
    <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                {columnContents.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}>
                                <MyFakeWords title={item.content} style={{ width: '150px' }} />
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
  );
};

class App extends Component {
    state = populateColumns(createState(2))

    onDragEnd = result => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        const items = reorder(
          this.state[source.droppableId],
          source.index,
          destination.index
        );

        this.setState((state={}) => Object.assign({}, state, {
          [source.droppableId]: items
        }));

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

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {

      const columnIds = Object.keys(this.state);
      columnIds.sort();

      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          {columnIds.map(columnId => (
            <Column columnId={columnId} columns={this.state} />
          ))}
        </DragDropContext>
      );
    }
}

export default App;
