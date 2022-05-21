<template>
<div class="wrapper">
  <Modal id="variableModal" ref="variableModal">
    <VariableEdit/>
  </Modal>
  
  <PdfBuilder
    v-if="template"
    :apiUrl="baseURL"
    :templateInfo="template"
  />
</div>
</template>

<script>
import axios from "axios";

import Modal from "../components/Modal.vue";
import VariableEdit from "../components/VariableEdit.vue";
import PdfBuilder from "../components/PdfBuilder.vue";

export default {
  components: { VariableEdit, Modal, PdfBuilder },

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
  },
  async mounted(){
    const templateId = this.$route.params.templateId;
    await this.fetchTemplateById(templateId);

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