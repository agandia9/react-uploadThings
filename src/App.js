import React, { Component } from 'react';
import firebase from 'firebase'
import FileUpload from './FileUpload.js'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      user: null
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.renderLoginButton = this.renderLoginButton.bind(this)
  }

  // WHEN COMPONENT IS MOUNT...
  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
    })
  }

  // LOGIN HANDLER
  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(`${result.user.email} ha iniciado sesión`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  // LOGOUT HANDLER
  handleLogout(){
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha cerrado sesión`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }
  // RENDER BUTTON HANDLER
    renderLoginButton() {
      // if user is logged
      if(this.state.user){
        return (
          <div>
            <img width="150" height="150" src={ this.state.user.photoURL } alt={ this.state.user.displayName } />
            <p>hola { this.state.user.displayName }!</p>
            <button onClick={this.handleLogout}> Salir </button>
            <FileUpload />
          </div>
        );
      } else {
        return(
        // if user is NOT logged
        <button onClick={ this.handleAuth }> Login with Google </button>
      )}

    }

    // RENDER COMPONENT HANDLER
  render() {
    return (
      // It's the same...
      // React.createElement('div',{ className: 'App'}, {
      // React.createElement('')
      // })
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Pseudogram</h2>
        </div>
        <p className="App-intro">
        { this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
