<template>
<div class="wrapper">
  <Modal id="variableModal" ref="variableModal">
    <VariableEdit/>
  </Modal>
  
  <PdfBuilder 
    :apiUrl="'http://localhost:5500'"
  />
</div>
</template>

<script>
import Modal from "../components/Modal.vue";
import VariableEdit from "../components/VariableEdit.vue";

import PdfBuilder from "../components/PdfBuilder.vue";

export default {
  components: { VariableEdit, Modal, PdfBuilder },
  methods: {
    setVariableModalRef(){
      this.$store.commit("setModalRef", {
        name: "variableModal",
        ref: this.$refs.variableModal,
      });
    },
  },
  mounted() {
    this.setVariableModalRef();
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