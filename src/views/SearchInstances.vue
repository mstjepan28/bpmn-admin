<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 sm9 offset-sm1 mt-3>
                <v-form @submit.prevent="">
                    <v-layout column>
                        <v-flex>
                            <v-text-field
                                v-model="query"
                                v-on:input="handleType"
                                filled
                                label="Search process instance"
                                type="text"
                                required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-flex>
            <v-flex xs12 sm9 offset-sm1 mt-3>
                <v-hover v-for="r in results" v-bind:key="r._id" v-slot="{ hover }">
                    <v-card class="mb-4" :elevation="hover ? 12 : 2">
                        <router-link :to="`instances/${r.id}`" custom v-slot="{ navigate }">
                            <div @click="navigate" style="cursor:pointer">
                                <v-card-title>
                                    {{ r.model.model_path }}
                                </v-card-title>
                                <v-card-subtitle>{{ r.id }}</v-card-subtitle>
                            </div>
                        </router-link>
                        <v-card-text>
                            <process-variables :variables="r.variables" />
                        </v-card-text>
                        <v-card-actions></v-card-actions>
                    </v-card>
                </v-hover>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import _ from 'lodash';
import { ProcessInstance } from '@/services';

export default {
    name: 'Home',

    data: () => ({
        query: '',
        results: [],
    }),
    mounted() {
        let query = this.$route.query;
        if (query.q) {
            this.query = query.q;
            this.doSearch();
        }
    },
    methods: {
        handleType: _.debounce(function() {
            this.doSearch();
        }, 500),
        doSearch: async function() {
            this.results = await ProcessInstance.search(this.query);
        },
    },
};
</script>
<style lang="scss" scoped></style>
