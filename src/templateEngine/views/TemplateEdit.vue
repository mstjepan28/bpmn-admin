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
    }
  },
  async mounted(){
    const templateId = this.$route.params.templateId;
    await this.fetchTemplateById(templateId);

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