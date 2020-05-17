import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';


Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        socket: io("http://localhost:3000")
    }
})