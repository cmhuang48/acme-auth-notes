import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const notes = (state = [], action)=> {
  if (action.type === 'LOAD_NOTES') {
    return action.notes;
  } 
  if (action.type === 'DESTROY_NOTE') {
    return state.filter(note => note.id !== action.note.id);
  }
  if (action.type === 'CREATE_NOTE') {
    return [...state, action.note];
  }
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

const logout = ()=> {
  window.localStorage.removeItem('token');
  return {
    type: 'SET_AUTH',
    auth: {}
  };
};

const signIn = (credentials)=> {
  return async(dispatch)=> {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    return dispatch(attemptLogin());
  }
};

const attemptLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  }
};

const loadNotes = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/notes', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'LOAD_NOTES', notes: response.data });
    }
  }
};

const destroyNote = (note)=> {
  return async (dispatch)=> {
    await axios.delete(`/api/notes/${note.id}`);
    dispatch({
      type: 'DESTROY_NOTE',
      note
    });
  }
};

const createNote = (txt)=> {
  return async (dispatch)=> {
    const note = (await axios.post('/api/notes', { txt })).data;
    dispatch({
      type: 'CREATE_NOTE',
      note
    });
  }
};

const store = createStore(
  combineReducers({
    auth,
    notes
  }),
  applyMiddleware(thunk, logger)
);

export { attemptLogin, signIn, logout, loadNotes, destroyNote, createNote };

export default store;
