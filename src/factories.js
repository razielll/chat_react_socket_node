const uuid = require('uuid/v4')

const createUser = ({ name = '', socketId = null } = {}) => {
    return {
        id: uuid(),
        name,
        socketId,
    }
};

const createMessage = ({ message = '', sender = '' } = {}) => (
    {
        id: uuid(),
        time: getTime(new Date(Date.now())),
        message,
        sender
    }
);


const createChat = ({ messages = [], name = "Community", users = [], isCommunity = false } = {}) => (
    {
        id: uuid(),
        name: isCommunity ? 'Community' : createChatNameFromUsers(users),
        messages,
        users,
        typingUsers: [],
        isCommunity,
    }
);

const getTime = date => `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;


const createChatNameFromUsers = (users, excludedUser = '') => {
    return users.filter((u) => u !== excludedUser).join(' & ') || 'Empty Users';
};

module.exports = {
    createChat,
    createMessage,
    createUser,
    createChatNameFromUsers
}