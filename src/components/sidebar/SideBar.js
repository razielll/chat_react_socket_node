import React, { Component } from 'react';
import SideBarOption from './SideBarOption';
import { last, get, differenceBy } from 'lodash';
import { FaSearch, FaListUl, FaChevronDown } from 'react-icons/fa';
import { MdEject } from 'react-icons/md/';
import { createChatNameFromUsers } from '../../factories';

export default class SideBar extends Component {

    static type = {
        CHATS: 'chats',
        USERS: 'users',
    }

    constructor(props) {
        super(props);
        this.state = {
            receiver: '',
            activeSideBar: SideBar.type.CHATS || 'chats'
        };
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { receiver } = this.state;
        const { onSendPrivateMessage } = this.props;
        console.log('Looking for ', receiver);
        this.setState({ receiver: '' });
        onSendPrivateMessage(receiver);
    };

    addChatForUser = username => {
        this.setActiveSideBar(SideBar.type.CHATS);
        this.props.onSendPrivateMessage(username);
    };

    setActiveSideBar = (type) => this.setState({ activeSideBar: type });

    render() {
        const { chats, activeChat, user, setActiveChat, logout, users } = this.props
        const { receiver, activeSideBar } = this.state;
        return (
            <div id="side-bar">
                <div className="heading">
                    <div className="app-name">Our Cool Chat <FaChevronDown /></div>
                    <div className="menu">
                        <FaListUl />
                    </div>
                </div>

                <form onSubmit={this.handleSubmit} className="search">
                    <i className="search-icon"><FaSearch /></i>
                    <input
                        placeholder="Search"
                        onChange={(e) => this.setState({ receiver: e.target.value })}
                        value={receiver}
                        type="text"
                    />
                    <div className="plus"></div>
                </form>

                <div className="side-bar-select">
                    <div
                        onClick={() => this.setActiveSideBar(SideBar.type.CHATS)}
                        className={`side-bar-select__option ${activeSideBar === SideBar.type.CHATS ? 'active' : ''}`}
                    >
                        <span>CHATS</span>
                    </div>
                    <div
                        onClick={() => this.setActiveSideBar(SideBar.type.USERS)}
                        className={`side-bar-select__option ${activeSideBar === SideBar.type.USERS ? 'active' : ''}`}
                    >
                        <span>USERS</span>
                    </div>
                </div>

                <div
                    className="users"
                    ref='users'
                    onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null) }}
                >
                    {
                        activeSideBar === SideBar.type.CHATS ?
                            chats.map((chat) => {
                                if (chat.name) {
                                    return (
                                        <SideBarOption
                                            key={chat.id}
                                            lastMessage={get(last(chat.messages), 'message', '')}
                                            name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)}
                                            active={activeChat.id === chat.id}
                                            onClick={() => { this.props.setActiveChat(chat) }}
                                        />
                                    )
                                }
                                return null
                            })
                            :
                            (
                                differenceBy(users, [user], 'name').map((otherUser) => {
                                    return (
                                        <SideBarOption
                                            key={otherUser.id}
                                            name={otherUser.name}
                                            onClick={() => { this.addChatForUser(otherUser.name) }}
                                        />
                                    )
                                })
                            )
                    }
                </div>
                <div className="current-user">
                    <span>{user.name}</span>
                    <div onClick={() => { logout() }} title="Logout" className="logout">
                        <MdEject />
                    </div>
                </div>
            </div >
        );

    }
}