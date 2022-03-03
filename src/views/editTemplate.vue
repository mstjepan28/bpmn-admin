<template>
    <PdfBuilder
        v-if="templateInstructions"
        :apiUrl="'http://localhost:5500'"
        :templateInstructions="templateInstructions"
    />
</template>

<script>
import PdfBuilder from "../pdfBuilder/pdfBuilder.vue";

export default {
    components: { PdfBuilder },

    data(){
        return{
            templateInstructions: null,
        }
    },

    methods:{
        getTemplateInstructions(){
            // TODO get request to fetch this from the backend
            return [
                {
                    positionData: {x: 0.035, y: 0.050666666666666665, width: 0.255, height: 0.168},
                    staticContent: false,
                    type: "singlelineText",
                    variable: null,
                },
                {
                    positionData: {x: 0.1025, y: 0.28888888888888886, width: 0.37625, height: 0.2071111111111111},
                    staticContent: false,
                    type: "singlelineText",
                    variable: null,
                },
                {
                    positionData: {x: 0.46875, y: 0.09333333333333334, width: 0.2025, height: 0.12711111111111112},
                    staticContent: false,
                    type: "singlelineText",
                    variable: null,
                }
            ]
        }
    },
    async mounted(){
        const templateId = this.$route.params.templateId;
        this.templateInstructions = await this.getTemplateInstructions(templateId);
    }
}
</script>

<style lang="scss">

</style>