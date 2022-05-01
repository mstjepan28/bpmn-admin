<template>
    <div>
        <div class="heading">
            <h1>PDF Templates</h1>
            <h2>
                <router-link class="createTemplateLink" to="/templates/create">Create new template</router-link>
            </h2>
        </div>
        <v-simple-table v-if="templateList.length >= 1">
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
                    </tr>
                </thead>

                <tbody>
                    <tr :key="template.id" v-for="template in templateList">
                        <td>{{ template.name }}</td>
                        <td>{{ template.created_by }}</td>
                        <td>{{ formateDateTime(template.created_at + "aaa") }}</td>
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
                                <button type="button" @click="selectedTemplate = template.id">Delete</button>
                            </span>
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

export default {
    data () {
        return {
            selectedTemplate: null,
            baseURL: 'http://localhost:5500',
            templateList: [],

            sorting: {
                sortBy: 'name',
                sortOrder: 'desc'
            }
        }
    },
    methods: {
        formateDateTime(timestamp) {
            return dayjs(parseInt(timestamp)).format('YYYY-MM-DD HH:mm:ss');
        },

        editTemplate(templateId){
            this.$router.push(`/templates/edit/${templateId}`)
        },

        selectToDelete(templateId){
            this.selectedTemplate = templateId;
        },
        cancelDelete(){
            this.selectedTemplate = null;
        },
        async deleteTemplate(){
            try{
                const response = await axios.delete(`${this.baseURL}/templates?id=${this.selectedTemplate}`);
                console.log(response.data);

                this.templateList = this.templateList.filter(template => template.id != this.selectedTemplate);
                this.selectToDelete = null;
            }catch(error){
                console.log(error);
            }
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
                const response = await axios.get(`${this.baseURL}/templates`);
                this.templateList = response.data;
                this.sortTemplates('updated_at');
            }catch(error){
                console.log(error)
            }
        }
    },

    async mounted(){
        await this.fetchTemplates();
    }
}
</script>

<style lang="scss" scoped>

.heading{
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1rem 1.5rem;

    button{
        font-weight: bold;
    }
}

.createTemplateLink{
    color: rgba(0, 0, 0, 0.87)
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
