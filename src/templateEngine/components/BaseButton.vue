<template>
  <button 
    class="primaryButton convertButton" 
    :class="{progress: isProcessing}" 
    :disabled="isProcessing"
    @click="clickHandler()" 
  > 
    <div v-if="isProcessing" class="progress">
      <LoadingIndicator 
        id="convertingIndicator" 
        size="30px" 
        thickness="5px"
        color="255, 255, 255"
      />
    </div>
    <div v-else>
      {{text}}
    </div>
  </button>
</template>

<script>
import LoadingIndicator from "./LoadingIndicator.vue";

export default {
  props:{
    text: {
      type: String,
      required: true
    },
    onclick: {
      type: Function,
      required: true
    },
  },
  components: { LoadingIndicator },
  data(){
    return{
      isProcessing: false,
    }
  },
  methods: {
    async clickHandler(){
      if(this.isProcessing) return;
      this.isProcessing = true;
      document.documentElement.style.cursor = "wait"

      await this.onclick();

      this.isProcessing = false;
      document.documentElement.style.cursor = ""
    }
  }
}
</script>

<style lang="scss">
@import "../styles/style.scss";

.convertButton{
  min-height: 45px;
  max-height: 45px;
}

button.primaryButton.progress{
  cursor: initial !important;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  color: $secondaryColor;
  background: $blueHighlight;

  &:hover{
    background: $blueHighlight;
  }
}
</style>