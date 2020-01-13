import React, { Component } from 'react';
import { VERIFY_USER } from '../events.js';

export default class LoginForm extends Component {


    constructor(props) {
        super(props);

        this.state = {
            nickname: '',
            error: null,
        }
    };


    setUser = ({ user, isUser }) => {
        if (isUser) {
            this.setError('User name taken');
        }
        else {
            this.setError("");
            this.props.setUser(user);
        }
    };

    setError = (error) => {
        this.setState({ error })
    }

    handleChange = (e) => this.setState({ nickname: e.target.value });

    handleSubmit = (e) => {
        e.preventDefault();
        const { nickname } = this.state;
        const { socket } = this.props;
        socket.emit(VERIFY_USER, nickname, this.setUser);
    };

    render() {
        const { nickname, error } = this.state
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <label htmlFor="nickname">
                        <h2>Got a nickname?</h2>
                        <input type="text" ref={(input) => this.textInput = input} id="nickname" value={nickname} onChange={this.handleChange} placeholder="Batman" />
                        <div className="error">{error ? error : ''}</div>
                    </label>
                </form>
            </div>
        )
    };
};
