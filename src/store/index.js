import { createStore } from 'vuex';

export default createStore({
  state: {
    github: false,
  },
  getters: {
    github: state => state.github,
  },
  mutations: {
    flipGithub(state) {
      state.github = !state.github;
    }
  },
  actions: {
    flipGithub({ commit }) {
      commit('flipGithub');
    }
  },
  modules: {
  }
});
