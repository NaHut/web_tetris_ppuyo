import React, { Component } from 'react';
import './bootstrap.css';
import io from "socket.io-client";

const ip = "127.0.0.1";
// const ip = "218.235.241.14";
const port = "8080"
const address = "http://" + ip + ":" + port

console.log(address);

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      clientIp: '',
      username: '',
      input: '',
    };

    this.socket = io(address);

    this.socket.on('RECEIVE_IP', function(data){
      setIp(data)
    })

    const setIp = data => {
      this.setState({clientIp : data})
    }

    // Get user info
    this.socket.on('RECEIVE_USERINFO', function(data){
      setUsername(data.nickname);
      setWin(data.win);
      setLose(data.lose);
    });

    const setUsername = data => {
      this.setState({username : data});
    }

    const setWin = data => {
      this.setState({win : data})
    }

    const setLose = data => {
      this.setState({lose : data})
    }
  }

  inputChange(event){
    this.setState({input: event.target.value})
  }

  usernameChange(){
    // this.state.username = this.state.input;
    this.setState({username: this.state.input});

    this.socket.emit('CHANGE_USERNAME',{
      username: this.state.username
    })
  }
  createRoom(){

  }

  render() {
    return (
      <div>
        <h1 style={{display: 'flex', justifyContent: 'center'}}> PPU TE </h1>
        
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button type="button" class="btn btn-primary btn-sm"
                  onClick={this.createRoom.bind(this)}>Create Room</button>
          &ensp;
          <form>
            <input type="text" name="nickname" 
                   onChange={this.inputChange.bind(this)}></input>
            <input type="submit" class="btn btn-primary btn-sm" value="change"
                   onClick={this.usernameChange.bind(this)}></input>
          </form>
        </div>

        <div>{this.state.username}</div>
              
        <br></br>

        <table style={{border: '1px solid white', width: '100%'}}>
        
          <div>
            Sample Room&ensp;
            <button type="button" class="btn btn-primary btn-sm">Enter</button>
          </div>

          <div>
            Sample Room2&ensp;
            <button type="button" class="btn btn-primary btn-sm">Enter</button>
          </div>

        </table>
      
      </div>
    );
  }
}

export default App;
