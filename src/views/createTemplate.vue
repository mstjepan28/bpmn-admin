<template>
    <PdfBuilder :apiUrl="'http://localhost:5500'"/>
</template>

<script>
import PdfBuilder from "../pdfBuilder/pdfBuilder.vue";

export default {
    components: { PdfBuilder }
}

</script>