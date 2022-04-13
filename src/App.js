import React from 'react';
import { connect } from 'react-redux';
import { attemptLogin, loadNotes } from './store';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Notes from './Notes';
import SignIn from './SignIn';

class App extends React.Component{
  componentDidMount(){
    this.props.attemptLogin();
    this.props.loadNotes();
  }
  render(){
    const { auth } = this.props;
    console.log(auth);

    if(!auth.id){
      return (
        <Switch>
          <Route path='/' component={SignIn} />
        </Switch>
      );
    }
    else {
      return (
        <Switch>
          <Route path='/home' component={ Home } />
          <Route path='/notes' component={ Notes } />
          <Redirect to='/home' />
        </Switch>
      );
    }
  }
}

const mapState = state => state;
const mapDispatch = (dispatch)=> {
  return {
    attemptLogin: ()=> {
      return dispatch(attemptLogin());
    },
    loadNotes: ()=> {
      return dispatch(loadNotes());
    }
  }
}

export default connect(mapState, mapDispatch)(App);
