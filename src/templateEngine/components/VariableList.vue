<template>
  <div class="variableEditorContainer">
    <h3 class="variableTitle">Variables:</h3>

    <form @submit.prevent="addVariable" class="variable-form">
      <input 
        class="variable-form-input"
        type="text" 
        placeholder="New variable name..."
        v-model="newVariable"
      />
      <button type="submit" class="primaryButton"> Add </button>
    </form>

    <div v-if="variableList.length > 0" class="variableList">
      <button 
        type="button" 
        class="variable"

        :key="variable.name" 
        v-for="variable in variableList"
        @click="openVariableModal(variable)"
      >{{ variable.name }}</button>
    </div>
    <div v-else class="variableList-empty">
      <h4>No variables to show...</h4>
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
    doesVariableExist(newVariable) {
      const foundElement = this.variableList.find(variable => variable.name === newVariable);
      return !!foundElement;
    },

    addVariable() {
      const variable = this.newVariable.trim();

      if(!variable.length || this.doesVariableExist(variable)) {
        return;
      }
      
      this.variableList.unshift({
        name: variable,
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

<style lang="scss" scoped>
@import "../styles/style.scss";

.variableTitle {
  margin-bottom: 0.5rem;
}

.variableEditorContainer{
  width: 100%;
}

.variable-form {
  display: flex;
  flex-direction: row;
  column-gap: 0.25rem;
  
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;

  border-bottom: 1px solid $secondaryColor;
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

.variableList-empty{
  @include flex(row, center, center);
  min-height: 5rem;
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