<template>
<div>
    <div v-if="!isEditEnabled" class="template-name-display">
      <button 
        type="button" 
        @click="enableEdit"
      >
        <h4>{{template.name}}</h4>
      </button>
    </div>

    <div v-else class="template-name-edit">
      <input 
        type="text"
        placeholder="Template name"
        v-model="template.name"
        maxlength="50"
      />
      <button 
        class="primaryButton"
        type="button"
        @click="disableEdit"
      >
        Save
      </button>
    </div>
</div>
</template>

<script>

export default {
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEditEnabled: false,
    }
  },
  methods: {
    enableEdit() {
      this.isEditEnabled = true;
    },
    disableEdit() {
      this.isEditEnabled = false;
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.template-name-display{
  word-wrap: break-word;
  
  h4 {
    text-align: start;
  }
}

.template-name-edit{
  display: flex;
  flex-direction: row;
  column-gap: 0.25rem;
}
</style>