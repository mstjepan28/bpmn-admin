<template>
<div class="wrapper">
  <Modal 
    header="Edit variable" 
    id="variableModal" 
    ref="variableModal"
  >
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
    setModalRefs(refList) {
      refList.forEach(ref => {
        this.$store.commit("setModalRef", { name: ref, ref: this.$refs[ref] });
      });
    },
    removeModalRefs() {
      this.$store.commit("removeModalRefs");
    }
  },
  mounted() {
    this.setModalRefs(["variableModal", "responsePopup"]);
  },
  beforeDestroy() {
    this.removeModalRefs();
  },
}

</script>

<style lang="scss">
.wrapper {
  min-width: 100%;

  display: flex;
  align-items: stretch;
}
</style>