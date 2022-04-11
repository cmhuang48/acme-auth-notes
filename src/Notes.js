import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { destroyNote } from './store';
import CreateNote from './CreateNote';

const Notes = ({ notes, destroyNote })=> {
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        <ul>
          {notes.map(note => {
            return (
              <li key={note.id}>
                {note.txt}
                <button onClick={() => destroyNote(note)}>X</button>
              </li>
            )
          })}
        </ul>
        <CreateNote />
      </div>
    </div>
  );
};

const mapStateToProps = ({ notes }) => ({ notes });

const mapDispatchToProps = (dispatch) => {
  return {
    destroyNote: (note) => {
      dispatch(destroyNote(note));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
