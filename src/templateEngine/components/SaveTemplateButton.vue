<template>
  <BaseButton
    :onclick="saveTemplate"
    text="Save template"
  />
</template>

<script>
import axios from "axios";
import BaseButton from "./BaseButton.vue";

export default {
  props:{
    apiUrl: {
      type: String,
      required: true
    },
    isNewTemplate: {
      type: Boolean,
      required: true
    },
    template: {
      type: Object,
      required: true
    },
    pdfTemplateBuffer: {
      type: ArrayBuffer,
      required: false
    },
  },
  components: { BaseButton },
  methods:{
    async createTemplate(data) {
      try{
        const response = await axios.post(`${this.apiUrl}/template`, data, {
          header : {'Content-Type': `multipart/form-data; boundary=${data._boundary}`}
        });
        
        this.$emit("openResponse", response.status, "Template created successfully.");
        this.$emit("templateSaved", response.data);
      }catch(error){
        const { data, status } = error.response;
        this.$emit("openResponse", status, data);
      }
    },

    async updateTemplate(data) {
      try{
        const response = await axios.put(`${this.apiUrl}/template`, data, {
          header : {'Content-Type': `multipart/form-data; boundary=${data._boundary}`}
        });
        
        this.$emit("openResponse", response.status, "Template updated successfully.");
      }catch(error){
        const { data, status } = error.response;
        this.$emit("openResponse", status, data);
      }
    },

    async saveTemplate(){
      const template = this.formatTemplate();

      const blobTemplate = new Blob([ JSON.stringify(template) ], { type: "application/json" });
      const blobPdfFile = new Blob([ this.pdfTemplateBuffer ], { type : 'application/pdf'})

      let data = new FormData();
      data.append("template", blobTemplate, "template")
      data.append("pdfTemplate", blobPdfFile, "pdfTemplate.pdf")

      if(this.isNewTemplate){
        await this.createTemplate(data);
      }
      else{
        await this.updateTemplate(data);
      }
    },

    formatTemplate() {
      const formattedSelectionList = this.formatSelectionList();
      const pdfDimensions = this.template.pdfDimensions || {width: 596, height: 842}
      
      return {
        ...this.template,
        pdfDimensions: pdfDimensions,
        selectionList: formattedSelectionList,
      }
    },

    // Filter data od list elements so it contains only relevant data
    formatSelectionList(){
      return this.template.selectionList.map(selection => {
        const normalizedPositionData = this.normalizePositionData(selection.positionData);
        const staticContent = this.getStaticContent(selection);
        
        return {
          positionData: normalizedPositionData,
          type: selection.type,
          variable: selection.variable,
          isStatic: selection.isStatic,
          staticContent: staticContent,
          internalComponent: !!selection.internalComponent
        }
      })
    },

    // This PDF and the one on the frontend do not match in dimensions so the positionData is offset. 
    //  To fix that the positionData is the percentage of the width/height of the PDF
    normalizePositionData(positionData){
      const pdfTemplate = document.querySelector("div.pdfTemplate")
      const width = pdfTemplate.offsetWidth;
      const height = pdfTemplate.offsetHeight;

      return{
        x: positionData.x / width,
        y: positionData.y / height, 
        width: positionData.width / width, 
        height: positionData.height / height, 
      }
    },

    // Get the base64 image from the internal component. If it doesn't exist return the existing static 
    //  content or false
    getStaticContent(selection){
      if(selection.internalComponent) {
        return selection.internalComponent.getImageSource();
      }
      
      return selection.staticContent;
    }
  }
}
</script>