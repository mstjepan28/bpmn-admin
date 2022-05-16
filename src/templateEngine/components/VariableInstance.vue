<template>
  <div class="variable">
    <div class="variable-main">
      <button type="button" class="variable-name" @click="toggleTypeSelection">{{ variable.name }}</button>
      <button type="button" @click="deleteVariable">X</button>
    </div>
    <div v-if="isTypeSelectionOpen" class="variable-type">
      <button 
        type="button" 
        class="variable-type-select" 
        :class="{selectedType: isSelectedType('text')}" 
        @click="selectType('text')"
      >
        Text
      </button>

      <button 
        type="button" 
        class="variable-type-select" 
        :class="{selectedType: isSelectedType('paragraph')}" 
        @click="selectType('paragraph')"
      >
        Paragraph
      </button>

      <button 
        type="button" 
        class="variable-type-select" 
        :class="{selectedType: isSelectedType('image')}" 
        @click="selectType('image')"
      >
        Image
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variable: {
      required: true,
      type: Object,
    }
  },
  data() {
    return {
      isTypeSelectionOpen: false,
    }
  },
  methods: {
    isSelectedType(type) {
      return this.variable.type === type;
    },

    toggleTypeSelection() {
      this.isTypeSelectionOpen = !this.isTypeSelectionOpen;
    },
    selectType(type) {
      this.$emit('typeSelected', {
        name: this.variable.name,
        type: type,
      });
    },
    deleteVariable() {
      this.$emit('deleteVariable', this.variable);
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.variable{
  display: flex;
  flex-direction: column;
}
.variable-main{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid $secondaryColor;

  .variable-name{
    max-width: 25ch;

    flex: 2;
    font-weight: bold;
    text-align: start;

    overflow-x: hidden;
  }
}

.variable-type{
  display: flex;
  column-gap: 4px;
  
  padding-top: 4px;
  padding-right: 4px;

  .variable-type-select{
    flex: 1;

    padding: 4px;
    
    cursor: pointer;
    
    border-radius: 5px;
    border: 1px solid $secondaryColor;

    &:hover, &:focus{
      color: $primaryColor;
      background-color: $blueHighlight;
    }
  }

  .selectedType{
    color: $primaryColor;
    font-weight: bold;
    background-color: $blueHighlight;
  }
}
</style>