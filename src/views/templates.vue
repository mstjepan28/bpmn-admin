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
                        <th class="text-left">Template name</th>
                        <th class="text-left">Created by </th>
                        <th class="text-left">Date created</th>
                        <th class="text-left">Edit template</th>
                        <th class="text-left">Delete template</th>
                    </tr>
                </thead>

                <tbody>
                    <tr :key="template.id" v-for="template in templateList">
                        <td>{{ template.template_name }}</td>
                        <td>{{ template.created_by }}</td>
                        <td>{{ template.date }}</td>
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

export default {
    data () {
        return {
            selectedTemplate: null,
            templateList: [
                {
                    "id": "3492993f-6bad-4b8c-806c-a15e04dcbbc8",
                    "template_name": "Suscipit.jpeg",
                    "created_by": "Torey Ferneley",
                    "date": "23/06/2021"
                },
                {
                    "id": "b7721e7a-2ea2-44b3-8b13-e9cdbbe62945",
                    "template_name": "Semper.avi",
                    "created_by": "Sumner Osbidston",
                    "date": "10/01/2022"
                },
                {
                    "id": "fc5f8030-2fd4-4cc4-9100-2b5687734d0e",
                    "template_name": "Posuere.avi",
                    "created_by": "Neville Jindrich",
                    "date": "27/01/2022"
                },
                {
                    "id": "45e908b8-22a0-4565-9849-5ad9af4eb5ee",
                    "template_name": "EratNulla.xls",
                    "created_by": "Fritz Thompstone",
                    "date": "13/11/2021"
                },
                {
                    "id": "5ed16d0d-3d77-4b57-9c98-9be7943a1054",
                    "template_name": "MalesuadaInImperdiet.avi",
                    "created_by": "Gracia Thaller",
                    "date": "21/01/2022"
                },
                {
                    "id": "b6581c41-19e2-457b-9099-2e2b232abd4f",
                    "template_name": "Quis.jpeg",
                    "created_by": "Francene Humpage",
                    "date": "09/01/2022"
                },
                {
                    "id": "2a952ad4-7311-48aa-b81f-c258b4ef5aaa",
                    "template_name": "Lacus.txt",
                    "created_by": "Cinda Waghorn",
                    "date": "15/12/2021"
                },
                {
                    "id": "33f415cc-6c2d-4157-84ea-354ff342e1af",
                    "template_name": "NisiEu.txt",
                    "created_by": "Ellene Huggill",
                    "date": "23/08/2021"
                },
                {
                    "id": "5aa4f281-19e9-4653-8e38-38c307f7a683",
                    "template_name": "PosuereCubiliaCurae.ppt",
                    "created_by": "Patrizius Greedyer",
                    "date": "30/05/2021"
                },
                {
                    "id": "b2543d36-8096-4fa7-9d98-2adce54ce8de",
                    "template_name": "EleifendPede.jpeg",
                    "created_by": "Rochell Buckenham",
                    "date": "01/05/2021"
                },
                {
                    "id": "41c6f956-dbac-43c1-aa66-910c27c0b4c3",
                    "template_name": "QuamFringillaRhoncus.avi",
                    "created_by": "Filmore Minnock",
                    "date": "24/07/2021"
                },
                {
                    "id": "c4f75a6a-a67f-4b7e-8b9a-6fd228945193",
                    "template_name": "Turpis.ppt",
                    "created_by": "Ursula Tooker",
                    "date": "20/03/2021"
                },
                {
                    "id": "78b70aeb-1684-492e-916c-a4b28d45d7f5",
                    "template_name": "JustoMorbiUt.png",
                    "created_by": "Bourke Fritzer",
                    "date": "12/09/2021"
                },
                {
                    "id": "14301f00-842a-44ea-89ca-a1fc6a30b327",
                    "template_name": "NullaNunc.gif",
                    "created_by": "Papagena Jiracek",
                    "date": "06/11/2021"
                },
                {
                    "id": "71245ad3-b109-474d-8e9f-31f8bd7d1f16",
                    "template_name": "AmetDiam.mp3",
                    "created_by": "Matilda Chatel",
                    "date": "08/02/2022"
                }
            ],
        }
    },
    methods: {
        editTemplate(templateId){
            this.$router.push(`/templates/edit/${templateId}`)
        },

        selectToDelete(templateId){
            this.selectedTemplate = templateId;
        },
        cancelDelete(){
            this.selectedTemplate = null;
        },
        deleteTemplate(){          
            this.templateList = this.templateList.filter(template => template.id != this.selectedTemplate);
            this.selectToDelete = null;

            // TODO - delete on the backend 
        }
    },
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

    background: #e5e5e4 !important;

    h2, h3{
        text-align: center;
    }

}
</style>
