import React from 'react';

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  render() {
    const editing = this.state.editing;
    return (
      <div>{this.props.task}</div>
    );
  }
}