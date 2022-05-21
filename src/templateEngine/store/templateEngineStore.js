export default {
  state: {
    modalRef: {
      variableModal: null,
      templateNameModal: null
    }
  },
  getters: {
    getModalRefByName: state => name => {
      return state.modalRef[name];
    }
  },
  mutations: {
    setModalRef(state, payload) {
      state.modalRef[payload.name] = payload.ref;
    }
  },
  dispatch: {
    setModalRef({ commit }, payload) {
      commit('setModalRef', payload);
    },
  }
}