const io = require('./index').io;
const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, LOGOUT, COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING, PRIVATE_MESSAGE, NEW_CHAT_USER } = require('../events');
const { createUser, createMessage, createChat } = require('../factories');


let communityChat = createChat({ isCommunity: true });
let connectedUsers = {};

module.exports = function (socket) {
    console.log('SocketId ' + socket.id);
    let sentMessageToChatFromUser;
    let sendTypingFromUser;

    // Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        // do DB check to decide isUser
        if (isUser(connectedUsers, nickname)) {
            callback({ isUser: true, user: null });
        } else {
            callback({ isUser: false, user: createUser({ name: nickname, socketId: socket.id }) });
        }
    });

    // User connected with username
    socket.on(USER_CONNECTED, (user) => {
        user.socketId = socket.id;
        connectedUsers = addUser(connectedUsers, user);
        console.log('CONNECTED');
        socket.user = user;
        sentMessageToChatFromUser = sendMessageToChat(user.name);
        sendTypingFromUser = sendTypingToChat(user.name);
        // console.log('connectedUsers', connectedUsers);
        socket.broadcast.emit(USER_CONNECTED, connectedUsers)
    });

    socket.on(COMMUNITY_CHAT, (callback) => callback(communityChat));

    socket.on(MESSAGE_SENT, ({ chatId, message }) => {
        sentMessageToChatFromUser(chatId, message);
    });

    // User disconnected
    socket.on('disconnect', () => {
        if ("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.name);
            io.emit(USER_DISCONNECTED, connectedUsers);
            // console.log('Disconnect', connectedUsers);
        };
    });

    // User logouts
    socket.on(LOGOUT, () => {
        console.log('sasd', socket.user)
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(LOGOUT, connectedUsers)
        console.log("Disconnect", connectedUsers);
    });

    socket.on(TYPING, ({ chatId, isTyping }) => {
        // console.log('TYPING', chatId, isTyping);
        sendTypingFromUser(chatId, isTyping);
    });

    socket.on(PRIVATE_MESSAGE, ({ receiver, sender, activeChat }) => {
        // console.log(`Private Message from ${sender} to ${receiver}`);
        if (receiver in connectedUsers) {
            const receiverSocket = connectedUsers[receiver].socketId;
            if (activeChat === null || activeChat.id === communityChat.id) {
                const newChat = createChat({ name: `${receiver}&${sender}`, users: [receiver, sender] });
                // notifies the receiver
                socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
                // notifies the user (us)
                socket.emit(PRIVATE_MESSAGE, newChat);
            } else {
                if (!(receiver in activeChat.users)) {
                    activeChat.users
                        .filter((user) => user in connectedUsers)
                        .map(user => connectedUsers[user])
                        .map(user => {
                            socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: receiver })
                        })
                    socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: receiver })
                }
                socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
            }
        };
    });

};

function sendMessageToChat(sender) {
    return (chatId, message) => {
        io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }));
    }
};

function sendTypingToChat(user) {
    return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, { user, isTyping });
    };
};

function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
};

function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList;
};

const isUser = (userList, userName) => {
    return userName in userList;
};