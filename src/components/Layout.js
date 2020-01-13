import React, { Component } from 'react';
import ChatContainer from './chats/ChatContainer.js';
import LoginForm from './LoginForm.js';
import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../events.js'

const SOCKET_URL = 'http://localhost:3232';
export default class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            user: null,
        }
    };

    componentDidMount() {
        this.initSocket();
    };

    initSocket = () => {
        const socket = io(SOCKET_URL);
        socket.on('connect', () => {
            if (this.state.user) {
                this.reconnect(socket)
            } else {
                console.log('Connected');
            }
        })
    };

    reconnect = (socket) => {
        socket.emit(VERIFY_USER, this.state.user.name, ({ isUser, user }) => {
            if (isUser) {
                this.state({ user: null });
            } else {
                this.setUser(user);
            }
        })
    };

    logout = () => {
        const { socket } = this.state;
        socket.emit(LOGOUT)
        this.setState({ user: null });
    };

    setUser = (user) => {
        const { socket } = this.state;
        socket.emit(USER_CONNECTED, user);
        this.setState({ user });
    };


    render() {
        const { socket, user } = this.state;
        return (
            <div className="container">
                {
                    !user ?
                        <LoginForm socket={socket} setUser={this.setUser} />
                        :
                        <ChatContainer socket={socket} user={user} logout={this.logout} />
                }
            </div>
        )
    };
};
