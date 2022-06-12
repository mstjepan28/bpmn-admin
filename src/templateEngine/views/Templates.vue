<template>
  <div>
    <Modal
      id="pdfFileModal"
      ref="pdfFileModal"
      header="Template files"
    >
      <PdfFileManager 
        :baseUrl="baseURL"
      />
    </Modal>

    <ResponsePopup
      ref="responsePopup"
    />
    
    <div class="heading">
      <h1>PDF Templates</h1>
      <h2>
        <router-link class="createTemplateLink" to="/templates/create">Create new template</router-link>
      </h2>
    </div>
    
    <v-text-field
      hide-details
      prepend-icon="mdi-magnify"
      single-line
      label="Search..."
      v-model="searchText"
      @input="searchTemplates"
    ></v-text-field>

    <v-simple-table v-if="isLoading" class="loading">
      <h2>Loading templates</h2>
      <LoadingIndicator
        id="templateLoading"
        size="100px"
        thickness="10px"
      />
    </v-simple-table>

    <v-simple-table v-else-if="templateListFiltered.length >= 1">
      <thead>
        <tr>
          <th class="text-left">
            <button type="button" @click="sortTemplates('name')">Template name</button>
          </th>
          <th class="text-left">
            <button type="button" @click="sortTemplates('created_by')">Created by</button>
          </th>
          <th class="text-left">
            <button type="button" @click="sortTemplates('created_at')">Created at</button>
          </th>
          <th class="text-left">
            <button type="button" @click="sortTemplates('updated_at')">Updated at</button>
          </th>
          <th class="text-left">
            Edit template
          </th>
          <th class="text-left">
            Delete template
          </th>
          <th class="text-left">
            PDF files
          </th>
        </tr>
      </thead>

      <tbody>
        <tr :key="template.id" v-for="template in templateListFiltered">
          <td>{{ template.name }}</td>
          
          <td>{{ template.created_by }}</td>
          
          <td>{{ formateDateTime(template.created_at) }}</td>
          
          <td>{{ formateDateTime(template.updated_at) }}</td>
          
          <td>
            <button type="button" @click="editTemplate(template.id)">Edit</button>
          </td>

          <td>
            <span class="confirm-container" v-if="selectedTemplate == template.id">
              <button type="button" @click="deleteTemplate()">Confirm</button>
              <button type="button" @click="cancelDelete()">Cancel</button>
            </span>

            <span v-else>
              <button type="button" @click="selectToDelete(template.id)">Delete</button>
            </span>
          </td>

          <td>
            <button type="button" @click="openFileModal(template.id)">Show</button>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <v-simple-table v-else class="noTemplates">
      <h2>No templates</h2>
      <h2>
        <router-link class="createTemplateLink" to="/templates/create">Create new template</router-link>
      </h2>
    </v-simple-table>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";

import Modal from "../components/Modal.vue";
import ResponsePopup from "../components/ResponsePopup.vue";
import PdfFileManager from "../components/PdfFileManager.vue";
import LoadingIndicator from "../components/LoadingIndicator.vue";

import { fuzzySearch } from "../util/fuzzySearch";

export default {
  components: { Modal, LoadingIndicator, ResponsePopup, PdfFileManager },
  data () {
    return {
      isLoading: true,
      selectedTemplate: null,
      baseURL: 'http://localhost:5500',
      templateList: [],
      templateListFiltered: [],

      sorting: {
        sortBy: 'name',
        sortOrder: 'desc'
      },
      searchText: "",
    }
  },
  methods: {
    openFileModal(templateId) {
      this.$refs.pdfFileModal.openModal({templateId})
    },

    formateDateTime(timestamp) {
      return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
    },
    
    editTemplate(templateId){
      this.$router.push(`/templates/edit/${templateId}`);
    },
    
    selectToDelete(templateId){
      this.selectedTemplate = templateId;
    },
    
    cancelDelete(){
      this.selectedTemplate = null;
    },

    async deleteTemplate(){
      try{
        await axios.delete(`${this.baseURL}/template?id=${this.selectedTemplate}`);

        this.templateList = this.templateList.filter(template => template.id !== this.selectedTemplate);
        this.selectedTemplate = null;

        this.sortTemplates();
        this.searchTemplates();
      }catch(error){
        console.log(error);
      }
    },

    searchTemplates(){
      if(this.searchText == "" || this.templateList.length < 1) {
        return this.templateListFiltered = this.templateList;
      }
      if(this.searchText.length < 3) {
        return;
      }

      this.templateListFiltered = this.templateList.filter(template => {
        const searchTextLowercase = this.searchText.toLowerCase();
        const searchByKeys = ["name"];

        for(let key of searchByKeys) {
          const isFound = fuzzySearch(searchTextLowercase, template[key].toLowerCase());
          if(isFound) return true;
        }
      })
    },

    sortTemplates(sortBy){
      let order;
      if(this.sorting.sortBy == sortBy){
        order = this.sorting.sortOrder == 'asc' ? 'desc' : 'asc';
      }

      this.templateList.sort((a, b) => {
        if(order == "asc"){
          if(a[sortBy] < b[sortBy]) return -1;
          if(a[sortBy] > b[sortBy]) return 1;
          return 0;
        }
        else{
          if(a[sortBy] < b[sortBy]) return 1;
          if(a[sortBy] > b[sortBy]) return -1;
          return 0;
        }
      });

      this.sorting = {
        sortBy: sortBy,
        sortOrder: order
      }
    },

    async fetchTemplates() {

      try{
        const response = await axios.get(`${this.baseURL}/template`);
        this.templateList = response.data;

        this.sortTemplates('updated_at');
        this.searchTemplates();
      }catch(error){
        console.log(error)
      }

      this.isLoading = false;
    },
    
    setModalRefs(refList) {
      refList.forEach(ref => {
        this.$store.commit("setModalRef", { name: ref, ref: this.$refs[ref] });
      });
    },
    removeModalRefs() {
      this.$store.commit("removeModalRefs");
    }
  },
  async mounted(){
    await this.fetchTemplates();
    this.setModalRefs(["responsePopup", "pdfFileModal"]);
  },
  beforeDestroy() {
    this.removeModalRefs();
  },
}
</script>

<style lang="scss">

.heading{
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem 1.5rem;

  button{
    font-weight: bold;
  }
}

.loading{
  text-align: center;
  margin: 2rem auto;
}

.createTemplateLink{
  color: rgba(0, 0, 0, 0.87) !important;
}

td button{
  display: flex;
  font-weight: bold;

  &:hover, &:focus{
    text-decoration: underline;
  }
}
.confirm-container{
  display: flex;
  column-gap: 1rem;
}

.noTemplates{
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 4rem 0;

  h2, h3{
    text-align: center;
  }

}
</style>
