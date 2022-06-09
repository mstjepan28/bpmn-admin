<template>
  <form @submit.prevent="updateVariable">

    <div class="variable-input">
      <input
        type="text"
        class="variable-input-name"
        v-model="variable.name"
        placeholder="Variable name"
        disabled
      />
    </div>

    <div class="variable-type">
      <button
        type="button"
        class="variable-type-select"
        :class="{ selectedType: isSelectedType('singlelineText') }"
        @click="selectType('singlelineText')"
      >
        Text
      </button>

      <button
        type="button"
        class="variable-type-select"
        :class="{ selectedType: isSelectedType('paragraph') }"
        @click="selectType('paragraph')"
      >
        Paragraph
      </button>

      <button
        type="button"
        class="variable-type-select"
        :class="{ selectedType: isSelectedType('image') }"
        @click="selectType('image')"
      >
        Image
      </button>
    </div>

    <div class="variable-input">
      <div v-if="variable.type === 'singlelineText'">
        <input
          type="text"
          class="variable-input-example"
          placeholder="Example of a single line of text"
          v-model="variable.example"
        />
      </div>
      <div v-else-if="variable.type === 'paragraph'">
        <textarea 
          class="variable-input-description"
          placeholder="Example of a paragraph"
          v-model="variable.example"
        ></textarea>
      </div>
      <div v-else>
        <textarea 
          class="variable-input-description"
          placeholder="Example of an image(url)"
          v-model="variable.example"
        ></textarea>  
      </div>

      <textarea 
        class="variable-input-description"
        placeholder="Variable description"
        v-model="variable.description"
      ></textarea>
    </div>

    <div class="variable-actions">
      <button type="button" class="variable-action-button delete" @click="deleteVariable">
        Delete
      </button>
      <button type="button" class="variable-action-button save" @click="updateVariable">
        Save
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      variable: {},
      isTypeSelectionOpen: false,
    };
  },
  computed: {
    variableData() {
      return this.data.providerData.data;
    },
  },
  methods: {
    isSelectedType(type) {
      return this.variable.type === type;
    },

    selectType(type) {
      this.variable.type = type;
    },

    updateVariable() {
      this.$store.commit("setUpdateVariable", this.variable);
    },

    deleteVariable() {
      this.$store.commit("setUpdateVariable", { ...this.variable, delete: true });
    },
  },
  inject: {
    data: "data",
  },
  watch: {
    variableData() {
      // Creating new object so changes are not reflected in the original object
      this.variable = {...this.variableData};
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.variable-input {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;

  margin-bottom: 1rem;

  input, textarea {
    width: 100%;

    resize: none;

    padding: 0.5rem;

    border-radius: 5px;
    border: 1px solid $highlightColor;

    &:focus, &:hover {
      border: 1px solid $blueHighlight;
    }
  }
}

.variable-type {
  display: flex;
  column-gap: 0.5rem;

  .variable-type-select {
    flex: 1;

    padding: 0.25rem;
    margin-bottom: 1rem;

    cursor: pointer;

    border-radius: 5px;
    border: 2px solid $secondaryColor;

    &:hover,
    &:focus {
      color: $primaryColor;
      background-color: $blueHighlight;
    }
  }

  .selectedType {
    color: $primaryColor;
    font-weight: bold;
    background-color: $blueHighlight;
  }
}

.variable-actions {
  width: 100%;

  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;

  margin-top: 1rem;

  .variable-action-button{
    padding: 0.5rem 1rem;

    cursor: pointer;

    border-radius: 5px;
    border: 2px solid $secondaryColor;

    &:hover, &:focus {
      color: $primaryColor;
      background-color: $blueHighlight;
    }

    &.delete:hover, &.delete:focus {
      color: $primaryColor;
      background-color: $redHighlight;
    }
  }
}
</style>
