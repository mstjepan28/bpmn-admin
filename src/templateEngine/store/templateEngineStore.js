export default {
  state: {
    modalRef: {
      variableModal: null,
      additionalDataModal: null,
      responsePopup: null,
      pdfFileModal: null,
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
    },

    removeModalRefs(state) {
      Object.keys(state.modalRef).forEach(key => {
        state.modalRef[key] = null
      });
    }
  },
}