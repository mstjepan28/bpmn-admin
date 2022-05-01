<template>
  <BaseButton
    :onclick="postPDFTemplate"
    text="Convert"
  />
</template>

<script>
import axios from "axios";
import BaseButton from "./baseButton.vue";

export default {
  props:{
    apiUrl: {
      type: String,
      required: true
    },
    template: {
      type: Object,
      required: true
    },
    pdfTemplateBuffer: {
      type: ArrayBuffer,
      required: false

    }
  },
  components: { BaseButton },
  methods:{
    async postPDFTemplate(){
      const selectionList = this.filterList();
      const pdfDimensions = this.template.pdfDimensions || {width: 596, height: 842}

      const blobPdfDimensions = new Blob([ JSON.stringify(pdfDimensions) ], { type: "application/json" });
      const blobSelectionList = new Blob([ JSON.stringify(selectionList) ], { type: "application/json" });
      const blobPdfTemplate = new Blob([ this.pdfTemplateBuffer ], { type : 'application/pdf'})

      let data = new FormData();
      data.append("pdfDimensions", blobPdfDimensions, "pdfDimensions")
      data.append("selectionList", blobSelectionList, "selectionList")
      data.append("pdfTemplate", blobPdfTemplate, "pdfTemplate.pdf")

      try{
        const response = await axios.post(`${this.apiUrl}/postTemplate`, data, {
          header : {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          }
        });
        
        this.$emit("openResponse", response.status);
      }catch(error){
        const status = error.message == "Network Error"? 408: 500;
        this.$emit("openResponse", status);
      }
    },

    // Filter data od list elements so it contains only relevant data
    filterList(){
      return this.template.selectionList.map(element => {
        const normalizedPositionData = this.normalizePositionData(element.positionData);
        const staticContent = this.getStaticContent(element);
        
        return {
          positionData: normalizedPositionData,
          type: element.type,
          variable: element.variable,
          staticContent: staticContent
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
    getStaticContent(element){
      if(element.internalComponent) return element.internalComponent.getImageSource();
      return element.variable? false: element.staticContent
    }
  }
}
</script>