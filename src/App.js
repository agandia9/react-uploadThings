import React, { Component } from 'react';
import firebase from 'firebase'
import FileUpload from './FileUpload.js'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      user: null,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.renderLoginButton = this.renderLoginButton.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  // WHEN COMPONENT IS MOUNT...
  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
    })

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
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

  handleUpload (event){
    const file = event.target.files[0]
    // `/fotos/${file.name}`=> this crash if cancels the upload...
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`)
    const task = storageRef.put(file)

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes)
      this.setState ({
        uploadValue: percentage
      })
    }, error => {console.log(error.message)
    },() => {
    const record = {
      photoURL: this.state.user.photoURL,
      displayName: this.state.user.displayName,
      image: task.snapshot.downloadURL
    }

    const dbRef = firebase.database().ref('pictures')
    const newPicture = dbRef.push()
    newPicture.set(record)
  })
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
            <FileUpload onUpload={this.handleUpload} />
            {
              this.state.pictures.map(picture => (
                <div>
                  <img width="150" height="150" src={picture.image} />
                  <br />
                  <img width="50" height="50" src={picture.photoURL} alt={picture.displayName}/>
                  <br />
                  <span>{picture.displayName}</span>
                </div>
              )).reverse()
            }
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
