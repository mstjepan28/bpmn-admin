<template>
<label 
  class="fileInstance"
  :class="{selected: isSelected}"
>
  <input 
    type="checkbox" 
    class="file-select"
    @change="toggleFileSelect"
    :checked="isSelected"
  >

  <h3 class="file-name">
    {{file}}
  </h3>
</label>
</template>

<script>

export default {
  props: {
    file: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isSelected: false
    }
  },
  methods: {
    toggleFileSelect() {
      this.isSelected = !this.isSelected;

      if(this.isSelected) {
        this.$emit('fileSelected', this.file);
      }
      else {
        this.$emit('fileDeselected', this.file);
      }
    }
  },
  watch: {
    selected() {
      this.isSelected = this.selected;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.selected {
  border: 1px solid $blueHighlight !important;
  background-color: rgba($blueHighlight, 0.25);
}

.fileInstance {
  display: flex;
  align-items: center;

  margin: 0.25rem 0;
  padding: 0.5rem 0.75rem;

  border-radius: 0.5rem;
  border: 1px solid $secondaryColor;

  .file-select {
    $checkbox-size: 1rem;
    width: $checkbox-size;
    height: $checkbox-size;

    margin-right: 0.75rem;
  }

  .file-name {
    max-width: 100%;
    overflow: hidden;
  }
}
</style>