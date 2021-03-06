import store from '@/store'

export default class SessionCache {

    static getAllConversations () {
        return store.state.session_conversations;
    }

    static getConversations (index = 'index_unarchived') {
        return SessionCache.getAllConversations()[index];
    }

    static getConversation (conversation_id) {
        let conversations = SessionCache.getConversations('index_unarchived')
        if (conversations != null) {
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].device_id == conversation_id) {
                    return conversations[i];
                }
            }
        }

        conversations = SessionCache.getConversations('index_archived')
        if (conversations != null) {
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].device_id == conversation_id) {
                    return conversations[i];
                }
            }
        }

        conversations = SessionCache.getConversations('index_private')
        if (conversations != null) {
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].device_id == conversation_id) {
                    return conversations[i];
                }
            }
        }

        return null;
    }

    static getAllMessages () {
        return store.state.session_messages;
    }

    static getMessages (conversation_id) {
        return SessionCache.getAllMessages()[conversation_id];
    }

    static putConversations (conversations, index = 'index_unarchived') {
        let sessionConversations = SessionCache.getAllConversations();
        sessionConversations[index] = conversations;

        store.commit('session_conversations', sessionConversations);
    }

    static putMessages (messages, conversation_id) {
        let sessionMessages = SessionCache.getAllMessages();
        sessionMessages[conversation_id] = messages;

        store.commit('session_messages', sessionMessages);
    }

    static hasConversations (index = 'index_unarchived') {
        return SessionCache.getConversations(index) != null;
    }

    static hasMessages (conversation_id) {
        let conversation = SessionCache.getConversation(conversation_id)
        let messages = SessionCache.getMessages(conversation_id);

        if (conversation == null || messages == null || messages.length == 0) {
            return false;
        }

        return messages[0].timestamp >= conversation.timestamp - 2000
    }

    static invalidateConversations (index = 'index_unarchived') {
        SessionCache.putConversations(null, index);
    }

    static invalidateMessages (conversation_id) {
        SessionCache.putMessages(null, conversation_id);
    }

    static invalidateAllConversations() {
        store.commit('session_conversations', { });
    }

    static invalidateAllMessages() {
        store.commit('session_messages', { });
    }

    static removeConversation (conversation_id, index = 'index_unarchived') {
        if (!SessionCache.hasConversations(index)) {
            return;
        }

        let conversations = SessionCache.getConversations(index);
        for (let i = 0; i < conversations.length; i++) {
            if (conversations[i].device_id == conversation_id) {
                conversations.splice(i, 1);
                break;
            }
        }

        SessionCache.putConversations(conversations, index);
    }

    static readConversation (conversation_id, index = 'index_unarchived') {
        if (!SessionCache.hasConversations(index)) {
            return;
        }

        let conversations = SessionCache.getConversations(index);
        for (let i = 0; i < conversations.length; i++) {
            if (conversations[i].device_id == conversation_id) {
                conversations[i].read = true;
                break;
            }
        }

        SessionCache.putConversations(conversations, index);
    }

    static cacheMessage (message) {
        if (!SessionCache.hasMessages(message.conversation_id)) {
            return;
        }

        let messages = SessionCache.getMessages(message.conversation_id);
        messages.unshift(message);

        SessionCache.putMessages(messages, message.conversation_id);
    }

    static updateMessageType (message_id, new_type) {
        let messages = SessionCache.getAllMessages();
        if (messages == null) {
            return;
        }

        for (var conversation_id in messages) {
            if (messages.hasOwnProperty(conversation_id)) {
                for (let i = 0; i < messages[conversation_id].length; i++) {
                    if (messages[conversation_id][i].device_id == message_id) {
                        messages[conversation_id][i].message_type = new_type;
                        break;
                    }
                }
            }
        }

        store.commit('session_messages', messages);
    }

    static updateConversation (message) {
        let conversations = SessionCache.getConversations('index_unarchived')
        if (conversations != null) {
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].device_id == message.conversation_id) {
                    conversations[i].timestamp = message.timestamp;
                    conversations[i].snippet = message.mime_type.indexOf("text") > -1 ? message.data : "";
                    this.putConversations(conversations, 'index_unarchived');
                    return;
                }
            }
        }

        conversations = SessionCache.getConversations('index_archived')
        if (conversations != null) {
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].device_id == message.conversation_id) {
                    conversations[i].timestamp = message.timestamp;
                    conversations[i].snippet = message.mime_type.indexOf("text") > -1 ? message.data : "";
                    this.putConversations(conversations, 'index_archived');
                    return;
                }
            }
        }

        conversations = SessionCache.getConversations('index_private')
        if (conversations != null) {
            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].device_id == message.conversation_id) {
                    conversations[i].timestamp = message.timestamp;
                    conversations[i].snippet = message.mime_type.indexOf("text") > -1 ? message.data : "";
                    this.putConversations(conversations, 'index_private');
                    return;
                }
            }
        }
    }
}
