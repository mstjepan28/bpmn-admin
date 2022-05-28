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
        :key="file.id"
        :fileData="file"
        v-for="file in fileList"
        :selected="isFileSelected(file.id)"
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
import PdfFileInstance from "./PdfFileInstance";

export default {
  components: { PdfFileInstance },
  data() {
    return {
      fileList: [
        {
          id: 1,
          name: "file1",
          created_by: "user1",
          created_at: "2020-01-01",
          updated_at: "2020-01-01"
        },
        {
          id: 2,
          name: "file2",
          created_by: "user2",
          created_at: "2020-01-01",
          updated_at: "2020-01-01"
        },
        {
          id: 3,
          name: "file3",
          created_by: "user3",
          created_at: "2020-01-01",
          updated_at: "2020-01-01"
        },
        {
          id: 4,
          name: "file4",
          created_by: "user4",
          created_at: "2020-01-01",
          updated_at: "2020-01-01"
        },
        {
          id: 5,
          name: "file5",
          created_by: "user5",
          created_at: "2020-01-01",
          updated_at: "2020-01-01"
        }
      ],
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
    }
  },
  methods: {
    deleteSelectedFiles() {
      console.log("deleteSelectedFiles", this.selectedFilesList);
    },

    downloadSelectedFiles() {
      console.log("downloadSelectedFiles", this.selectedFilesList);
    },

    isFileSelected(fileId) {
      return !!this.selectedFilesList.filter(file => file.id === fileId).length;
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

    fileSelected(file) {
      this.selectedFilesList.push(file);
      this.isAllSelected = this.selectedFilesList.length === this.fileList.length;
    },
    fileDeselected(fileId) {
      this.selectedFilesList = this.selectedFilesList.filter(file => file.id !== fileId);
      this.isAllSelected = false;
    }
  },
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