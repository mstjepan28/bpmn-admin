<template>
<div class="wrapper">
  <Modal 
    id="variableModal" 
    header="Edit variable" 
    ref="variableModal"
  >
    <VariableEdit/>
  </Modal>

  <ResponsePopup
    ref="responsePopup"
  />
  
  <PdfBuilder
    v-if="template"
    :apiUrl="baseURL"
    :templateInfo="template"
  />
</div>
</template>

<script>
import axios from "axios";

import ResponsePopup from "../components/ResponsePopup.vue";
import Modal from "../components/Modal.vue";
import VariableEdit from "../components/VariableEdit.vue";
import PdfBuilder from "../components/PdfBuilder.vue";

export default {
  components: { ResponsePopup, VariableEdit, Modal, PdfBuilder },

  data(){
    return{
      template: null,
      baseURL: 'http://localhost:5500'
    }
  },

  methods:{
    async fetchTemplateById(templateId){
      try{
        const response = await axios.get(`${this.baseURL}/templates?id=${templateId}`);
        this.template = response.data;
      }catch(error){
        console.log(error)
      }
    },

    setModalRefs(refList) {
      refList.forEach(ref => {
        this.$store.commit("setModalRef", { name: ref, ref: this.$refs[ref] });
      });
    },
    removeModalRefs() {
      this.$store.commit("removeModalRefs");
    }
  },
  async mounted(){
    const templateId = this.$route.params.templateId;
    await this.fetchTemplateById(templateId);

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