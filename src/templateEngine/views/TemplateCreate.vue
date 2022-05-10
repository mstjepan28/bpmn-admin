<template>
  <PdfBuilder 
    :apiUrl="'http://localhost:5500'"
  />
</template>

<script>
import PdfBuilder from "../components/PdfBuilder.vue";

export default {
  components: { PdfBuilder }
}

</script>