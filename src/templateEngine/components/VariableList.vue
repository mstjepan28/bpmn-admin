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
      <button 
        type="button" 
        class="variable"

        :key="variable.name" 
        v-for="variable in variableList"
        @click="openVariableModal(variable)"
      >{{ variable.name }}</button>
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
  computed: {
    changingVariable() {
      return this.$store.getters.getUpdatedVariable;
    }
  },
  methods: {
    doesVariableExist() {
      const foundElement = this.variableList.find(variable => variable.name === this.newVariable);
      return !!foundElement;
    },

    addVariable() {
      this.newVariable = this.newVariable.trim();

      if(this.newVariable.length > 0 && !this.doesVariableExist()) {
        return;
      }
      
      this.variableList.unshift({
        name: this.newVariable,
        type: 'singlelineText'
      })

      this.newVariable = "";
      this.$emit('updateVariables', this.variableList);
    },

    openVariableModal(variable) {
      const variableModal = this.$store.getters.getModalRefByName("variableModal");
      variableModal.openModal(variable);
    },

    closeVariableModal() {
      const variableModal = this.$store.getters.getModalRefByName("variableModal");
      variableModal.closeModal();
    },
    
    updateType(updateVariable) {
      this.variableList = this.variableList.map(variable => {
        if (variable.name === updateVariable.name) {
          return updateVariable;
        }
        return variable;
      });

      this.$emit('updateVariables', this.variableList);
      this.closeVariableModal();
    },

    deleteVariable(variable) {
      this.variableList = this.variableList.filter(v => v.name !== variable.name);
      this.$emit('updateVariables', this.variableList);
      this.closeVariableModal();
    }
  },
  watch: {
    templateVariables() {
      this.variableList = this.templateVariables;
    },

    changingVariable() {
      if(!this.changingVariable) {
        return;
      }
      else if(this.changingVariable.delete) {
        this.deleteVariable(this.changingVariable);
      }
      else {
        this.updateType(this.changingVariable);
      }

      this.$store.commit('setUpdateVariable', null);
    }
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

.variable{
  width: 100%;

  padding: 0.25rem;

  font-weight: bold;
  text-align: start;

  overflow-x: hidden;

  border-bottom: 1px solid $secondaryColor;
}
</style>