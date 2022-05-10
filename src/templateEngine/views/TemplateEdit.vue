<template>
  <PdfBuilder
    v-if="template"
    :apiUrl="baseURL"
    :templateInfo="template"
  />
</template>

<script>
import axios from "axios";
import PdfBuilder from "../components/PdfBuilder.vue";

export default {
  components: { PdfBuilder },

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
    }
  },
  async mounted(){
    const templateId = this.$route.params.templateId;
    await this.fetchTemplateById(templateId);
  }
}
</script>