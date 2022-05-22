<template>
<div class="wrapper">
  <Modal id="variableModal" ref="variableModal">
    <VariableEdit/>
  </Modal>

  <ResponsePopup
    ref="responsePopup"
  />
  
  <PdfBuilder 
    :apiUrl="'http://localhost:5500'"
  />
</div>
</template>

<script>
import ResponsePopup from "../components/ResponsePopup.vue";
import Modal from "../components/Modal.vue";
import VariableEdit from "../components/VariableEdit.vue";

import PdfBuilder from "../components/PdfBuilder.vue";

export default {
  components: { ResponsePopup, VariableEdit, Modal, PdfBuilder },
  methods: {
    setVariableModalRef(){
      this.$store.commit("setModalRef", {
        name: "variableModal",
        ref: this.$refs.variableModal,
      });
    },
    setResponsePopupRef(){
      this.$store.commit("setModalRef", {
        name: "responsePopup",
        ref: this.$refs.responsePopup,
      });
    },
  },
  mounted() {
    this.setVariableModalRef();
    this.setResponsePopupRef();
  }
}

</script>

<style lang="scss">
.wrapper {
  min-width: 100%;

  display: flex;
  align-items: stretch;
}
</style>