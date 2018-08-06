import Vue from 'vue';

export const KEYS  = {
    ACCOUNT_ID: 'account_id',
    HASH: 'hash',
    SALT: 'salt',
    CONTACTS: 'contacts',
    CONVERSATIONS: 'conversations',
    NOTIFICATIONS: 'notifications',
    ENTER_TO_SEND: 'enter_to_send',
    THEME: {
        BASE: 'theme_base',
        GLOBAL_DEFAULT: 'theme_global_default',
        GLOBAL_DARK: 'theme_global_dark',
        GLOBAL_ACCENT: 'theme_global_accent',
        USE_GLOBAL: 'theme_use_global'
    }
}

const empty_str = "\"\"";

export const state = {
    /* Persistent */
    account_id: JSON.parse( window.localStorage.getItem(KEYS.ACCOUNT_ID) || empty_str ),
    hash: JSON.parse( window.localStorage.getItem(KEYS.HASH) || empty_str ),
    salt: JSON.parse( window.localStorage.getItem(KEYS.SALT) || empty_str ),
    contacts: JSON.parse( window.localStorage.getItem(KEYS.CONTACTS) || '{}' ),
    conversations: JSON.parse( window.localStorage.getItem(KEYS.CONVERSATIONS) || '{}' ),

    theme_base: JSON.parse( window.localStorage.getItem(KEYS.THEME.BASE) || "\"light\"" ),
    theme_global_default: JSON.parse( window.localStorage.getItem(KEYS.THEME.GLOBAL_DEFAULT) || "\"#009688\"" ),
    theme_global_dark: JSON.parse( window.localStorage.getItem(KEYS.THEME.GLOBAL_DARK) || "\"#00695C\"" ),
    theme_global_accent: JSON.parse( window.localStorage.getItem(KEYS.THEME.GLOBAL_ACCENT) || "\"#FFAB40\"" ),
    theme_use_global: JSON.parse( window.localStorage.getItem(KEYS.THEME.USE_GLOBAL) || "false" ),
    notifications: JSON.parse( window.localStorage.getItem(KEYS.NOTIFICATIONS) || "true" ),
    enter_to_send: JSON.parse( window.localStorage.getItem(KEYS.ENTER_TO_SEND) || "true" ),

    /* Per session */
    aes: '',
    full_theme: true,
    sidebar_open: true,
    title: "Pulse SMS",
    loading: true,

    colors_default: JSON.parse( window.localStorage.getItem(KEYS.THEME.GLOBAL_DEFAULT) || "\"#009688\"" ),
    colors_dark: JSON.parse( window.localStorage.getItem(KEYS.THEME.GLOBAL_DARK) || "\"#00695C\"" ),
    colors_accent: JSON.parse( window.localStorage.getItem(KEYS.THEME.GLOBAL_ACCENT) || "\"#FFAB40\"" ),
    colors_text: "#ffffff",

    msgbus: new Vue(),
    media_loader: null,

    loaded_media: null,
    media_sending: false,

    offline: !navigator.onLine,

    last_ping: null,
    last_passcode_entry: null,

    session_conversations: { },
    session_messages: { },
    session_contacts: { },
}

export const getters = {
    getConversationData: (state) => (id) => {
        return state.conversations[id];
    },
    getContact: (state) => (id) => {
        return state.contacts[id];
    }
}

export const mutations = {
    title: (state, title) => state.title = title,
    loading: (state, loading) => state.loading = loading,
    full_theme: (state, full_theme) => state.full_theme = full_theme,
    sidebar_open: (state, sidebar_open) => state.sidebar_open = sidebar_open,
    account_id: (state, account_id) => state.account_id = account_id,
    hash: (state, hash) => state.hash = hash,
    salt: (state, salt) => state.salt = salt,
    aes: (state, aes) => state.aes = aes,
    theme_base: (state, theme_base) => state.theme_base = theme_base,
    theme_global_default: (state, theme_global_default) => state.theme_global_default = theme_global_default,
    theme_global_dark: (state, theme_global_dark) => state.theme_global_dark = theme_global_dark,
    theme_global_accent: (state, theme_global_accent) => state.theme_global_accent = theme_global_accent,
    theme_use_global: (state, theme_use_global) => state.theme_use_global = theme_use_global,
    notifications: (state, notifications) => state.notifications = notifications,
    enter_to_send: (state, enter_to_send) => state.enter_to_send = enter_to_send,
    media_loader: (state, media_loader) => state.media_loader = media_loader,
    colors_default: (state, colors_default) => state.colors_default = colors_default,
    colors_dark: (state, colors_dark) => state.colors_dark = colors_dark,
    colors_accent: (state, colors_accent) => state.colors_accent = colors_accent,
    loaded_media: (state, loaded_media) => state.loaded_media = loaded_media,
    media_sending: (state, media_sending) => state.media_sending = media_sending,
    last_ping: (state, last_ping) => state.last_ping = last_ping,
    last_passcode_entry: (state, last_passcode_entry) => state.last_passcode_entry = last_passcode_entry,
    session_conversations: (state, session_conversations) => state.session_conversations = session_conversations,
    session_messages: (state, session_messages) => state.session_messages = session_messages,
    session_contacts: (state, session_contacts) => state.session_contacts = session_contacts,
    theme_global: (state, colors) => {
        // this mutation wasn't getting pushed through the plugin to write to the local storage
        // so the global theme was being queried every time.

        if (colors.default && colors.dark && colors.accent) {
            state.theme_global_default = colors.default;
            state.theme_global_dark = colors.dark;
            state.theme_global_accent = colors.accent;

            window.localStorage.setItem("theme_global_default", JSON.stringify(colors.default));
            window.localStorage.setItem("theme_global_dark", JSON.stringify(colors.dark));
            window.localStorage.setItem("theme_global_accent", JSON.stringify(colors.accent));
        }
    },
    colors: (state, colors) => {
        state.colors_default = colors.default;
        state.colors_dark = colors.dark;
        state.colors_accent = colors.accent;
    },
    conversations: (state, payload) => {
        if(!Array.isArray(payload))
            payload = [ payload ]

        for(let i = 0; i < payload.length; i++)
            state.conversations[payload[i].id] = payload[i]
    },
    contacts: (state, payload) => {
        if(!Array.isArray(payload))
            payload = [ payload ]

        for(let i = 0; i < payload.length; i++)
            state.contacts[payload[i].id] = payload[i]
    },
    clearContacts: (state, payload) => {
        state.contacts = {};
    },
}

export const actions = {

}
