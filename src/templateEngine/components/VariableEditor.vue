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
      <VariableInstance 
        v-for="variable in variableList"
        :key="variable.name"
        :variable="variable"
        @deleteVariable="deleteVariable"
        @typeSelected="updateType"
      />
    </div>
    
  </div>
</template>

<script>
import VariableInstance from './VariableInstance.vue';

export default {
  props: {
    templateVariables: {
      type: Array,
      required: true
    }
  },
  components: { VariableInstance },
  data() {
    return {
      newVariable: "",
      variableList: [],
    }
  },
  methods: {
    doesVariableExist() {
      const foundElement = this.variableList.find(variable => variable.name === this.newVariable);
      return !!foundElement;
    },

    addVariable() {
      if(!this.doesVariableExist()) {
        this.variableList.push({
          name: this.newVariable,
          type: 'text'
        })
      }

      this.newVariable = "";
    },
    updateType(updateVariable) {
      this.variableList.forEach(variable => {
        if (variable.name === updateVariable.name) {
          variable.type = updateVariable.type;
        }
      });

      this.$emit('updateVariables', this.variableList);
    },
    deleteVariable(variable) {
      this.variableList = this.variableList.filter(v => v.name !== variable.name);
      this.$emit('updateVariables', this.variableList);
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
    border-bottom: 1px solid $secondaryColor
  }
}

.variableList{
  max-height: 15rem;
  min-height: 15rem;
  overflow-y: auto;

  scrollbar-width: none;
  &::-webkit-scrollbar { 
    display: none;  
  }
}
</style>