<template>
    <PdfBuilder
        v-if="templateInfo"
        :apiUrl="'http://localhost:5500'"
        :templateInfo="templateInfo"
    />
</template>

<script>
import PdfBuilder from "../pdfBuilder/pdfBuilder.vue";

export default {
    components: { PdfBuilder },

    data(){
        return{
            templateInfo: null,
        }
    },

    methods:{
        getTemplateInfo(){
            // TODO get request to fetch this from the backend
            return {
                id: "362b2d2a-e709-4e53-815c-01ebf11a882f",
                instructionList: [
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
                    },
                    {
                        positionData: {x: 0.2625, y: 0.568, width: 0.48375, height: 0.32711111111111113},
                        staticContent: false,
                        type: "image",
                        variable: null,
                    }
                ]
            }
        }
    },
    async mounted(){
        const templateId = this.$route.params.templateId;
        this.templateInfo = await this.getTemplateInfo(templateId);
    }
}
</script>

<style lang="scss">

</style>