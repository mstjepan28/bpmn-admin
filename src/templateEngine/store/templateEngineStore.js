export default {
  state: {
    modalRef: {
      variableModal: null,
      additionalDataModal: null,
      responsePopup: null,
    },
    
    updatedVariable: null,
  },
  getters: {
    getModalRefByName: state => name => {
      return state.modalRef[name];
    },

    getUpdatedVariable: state => {
      return state.updatedVariable;
    }
  },
  mutations: {
    setModalRef(state, payload) {
      state.modalRef[payload.name] = payload.ref;
    },

    setUpdateVariable(state, payload) {
      state.updatedVariable = payload;
    }
  },
}