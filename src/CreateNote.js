import React from 'react';
import { connect } from 'react-redux';
import { createNote } from './store';

class CreateNote extends React.Component {
  constructor () {
    super();
    this.state = {
      txt: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit (ev) {
    const { txt } = this.state;
    ev.preventDefault();
    this.props.createNote(txt);
  }
  onChange (ev) {
    const change = {};
    change[ev.target.name] = ev.target.value;
    this.setState(change);
  }
  render () {
    const { txt } = this.state;
    const { onChange, onSubmit } = this;
    return (
      <form onSubmit={onSubmit}>
        <input name='txt' value={txt} placeholder='Enter New Note' onChange={onChange} />
        <button disabled={!txt}>Create</button>
      </form>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    createNote: (txt) => dispatch(createNote(txt))
  };
};

export default connect(null, mapDispatchToProps)(CreateNote);