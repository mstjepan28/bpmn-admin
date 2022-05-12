<template>
  <div class="variableEditorContainer">
    <h2>Variables:</h2>

    <form  @submit.prevent="addVariable">
      <input 
        class="newVariableInput"
        type="text" 
        placeholder="Add new variable name..."
        v-model="newVariable"
      />
    </form>

    <div class="variableList">
      <div class="variable" :key="variable.name" v-for="variable in variableList">
        {{ variable.name }}
      </div>
    </div>
    
  </div>
</template>

<script>

export default {
  props: {
    templateVariables: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newVariable: "",
      variableList: [],
    }
  },
  methods: {
    addVariable() {
      this.variableList.push({
        name: this.newVariable,
      })
      this.newVariable = "";
      console.log(this.variableList)
    }
  },
  mounted() {
    this.variableList = this.templateVariables;
  }
}
</script>

<style lang="scss">
@import "../styles/style.scss";

.variableEditorContainer{
  width: 100%;

  .newVariableInput {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
</style>