<template>
<div class="fileManager">
  <p class="description">
    Files generated based on this template will be shown below.
  </p>

  <div v-if="fileList.length > 0" class="content">
    <div class="fileActions">
      <label class="action-selectAll">
        <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected">
        {{selectAllLabel}}
      </label>

      <button 
        type="button" 
        class="primaryButton-red"
        :disabled="!isAnySelected"
        @click="deleteSelectedFiles"
      >
        Delete
      </button>
      <button 
        type="button" 
        class="primaryButton"
        :disabled="!isAnySelected"
        @click="downloadSelectedFiles"
      >
        Download
      </button>
    </div>

    <div class="fileList">
      <PdfFileInstance 
        :key="file"
        :file="file"
        v-for="file in fileList"
        :selected="isFileSelected(file)"
        @fileSelected="fileSelected"
        @fileDeselected="fileDeselected"
      />
    </div>
  </div>
  <div v-else class="content empty">
    <h2>No files found</h2>
    <button type="button" class="primaryButton">Generate new Files</button>
  </div>
</div>
</template>

<script>
import axios from "axios";
import PdfFileInstance from "./PdfFileInstance";

export default {
  props: {
    baseUrl: {
      type: String,
      required: true
    }
  },
  components: { PdfFileInstance },
  data() {
    return {
      fileList: [],
      selectedFilesList: [],

      isAllSelected: false,
    }
  },
  computed: {
    selectAllLabel() {
      return this.isAllSelected ? "Deselect all" : "Select all";
    },
    isAnySelected() {
      return this.selectedFilesList.length > 0;
    },
    templateId() {
      return this.data.providerData.data.templateId
    }
  },
  methods: {
    async fetchFiles() {
      if(!this.templateId) {
        return;
      }

      this.selectedFilesList = [];

      try{
        const res = await axios.get(`${this.baseUrl}/templates/${this.templateId}/files`);
        this.fileList = res.data;
      }catch(e){
        this.fileList = []
        console.log(e);
      }
    },

    async deleteSelectedFiles() {
      try{
        await axios.post(`${this.baseUrl}/templates/${this.templateId}/files/remove`,
          {
            fileList: this.selectedFilesList
          }
        );

        this.fileList = this.fileList.filter(file => !this.selectedFilesList.includes(file));
        this.selectedFilesList = [];
      }catch(e){
        console.log(e);
      }
    },

    async downloadSelectedFiles() {
      if(this.selectedFilesList.length === 0) {
        return;
      }

      try{
        const response = await axios.post(`${this.baseUrl}/templates/${this.templateId}/files`,
          {
            fileList: this.selectedFilesList
          },
          {
            responseType: "blob"
          }
        );

        const fileName = this.selectedFilesList.length === 1 ? this.selectedFilesList[0] : `${this.templateId}.rar`;

        const blob = new Blob([response.data], { type: "application/octet-stream" });

        const fileLink = document.createElement('a');
        fileLink.href = window.URL.createObjectURL(blob);
        fileLink.setAttribute('download', fileName);

        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
      }catch(e) {
        console.log(e);
      }
    },

    isFileSelected(checkFile) {
      return !!this.selectedFilesList.filter(file => file === checkFile).length;
    },

    toggleSelectAll() {
      this.isAllSelected = !this.isAllSelected;

      if(this.isAllSelected) {
        this.selectedFilesList = this.fileList;
      }
      else {
        this.selectedFilesList = [];
      }
    },

    fileSelected(selectedFile) {
      this.selectedFilesList.push(selectedFile);
      this.isAllSelected = this.selectedFilesList.length === this.fileList.length;
    },
    fileDeselected(deselectedFile) {
      this.selectedFilesList = this.selectedFilesList.filter(file => file !== deselectedFile);
      this.isAllSelected = false;
    }
  },
  inject: {
    data: "data",
  },
  watch: {
    templateId() {
      this.fetchFiles();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.description {
  padding: 0.25rem 0 0.5rem 0;
  border-bottom: 1px solid $secondaryColor;
}

.fileActions {
  display: flex;
  align-items: center;

  margin: 0.25rem 0 1.25rem 0.75rem;

  .action-selectAll {
    display: flex;
    align-items: center;
    column-gap: 0.75rem;

    margin-right: auto;

    white-space: nowrap;
    
    input {
      $checkbox-size: 1rem;
      width: $checkbox-size;
      height: $checkbox-size;

    }
  }

  button:first-of-type {
    margin-right: 0.5rem;
  }
}

.fileList {
  max-height: 19.75rem;
  overflow-y: auto;
}

.content {
  display: flex;
  flex-direction: column;

  padding: 1rem 0.5rem;

  border: 1px solid $secondaryColor;
  border-radius: 0.5rem;

  &.empty {
    align-items: center;

    h2 {
      text-align: center;
    }

    button {
      max-width: fit-content;

      margin: 1rem 0;
      padding: 0.5rem 1rem;
    }
  }
}
</style>