<template>
<div>
    <div v-if="!isEditEnabled" class="template-name-display">
      <button 
        type="button" 
        @click="enableEdit"
      >
        <h3>{{template.name}}</h3>
      </button>
    </div>

    <div v-else>
      <form @submit.prevent="saveName" class="template-name-edit">
        <input 
          type="text"
          placeholder="Template name"
          v-model="newName"
          maxlength="50"
        />
        <button 
          class="primaryButton"
          type="submit"
          @click="saveName"
          :disabled="isLoading"
        >
          Save
        </button>
      </form>
      <span>{{invalidMsg}}</span>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    template: {
      type: Object,
      required: true
    },
    apiUrl: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      newName: "",
      isEditEnabled: false,

      invalidMsg: "",
      isLoading: false,
    }
  },
  methods: {
    async checkIfAvailable() {
      try {
        const response = await axios.get(`${this.apiUrl}/template/exists?name=${this.newName}`);
        return response.data.exists;
      }catch(error) {
        console.log(error);
        return true;
      }
    },

    async isNameValid() {
      if(this.newName == this.template.name) {
        this.invalidMsg = "";
        return true;
      }

      if(this.newName.trim().length <= 10) {
        this.invalidMsg = "Name has to be descriptive.";
        return false;
      }

      const isNameTaken = await this.checkIfAvailable();
      if(isNameTaken) {
        this.invalidMsg = "Name is already taken.";
        return false;
      }

      this.invalidMsg = "";
      return true;
    },

    enableEdit() {
      this.isEditEnabled = true;
      this.newName = this.template.name;
    },

    async saveName() {
      this.isLoading = true;

      const isValid = await this.isNameValid();
      if(isValid) {
        this.isEditEnabled = false;
        this.template.name = this.newName.trim();
      }

      setTimeout(() => this.invalidMsg = "", 4000);
      this.isLoading = false;
    },
  },
  mounted() {
    this.newName = this.template.name;
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