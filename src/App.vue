<template>
    <!-- App.vue -->

    <v-app>
        <v-navigation-drawer app permanent expand-on-hover>
            <v-list>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/lego/5.jpg"></v-img>
                    </v-list-item-avatar>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Administrator
                        </v-list-item-title>
                        <v-list-item-subtitle>admin@unipu.hr</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list nav dense>
                <v-list-item link to="/models">
                    <v-list-item-icon>
                        <v-icon>mdi-folder</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Models</v-list-item-title>
                </v-list-item>
                <v-list-item link to="/instances">
                    <v-list-item-icon>
                        <v-icon>mdi-text-search</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Running instances</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-star</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Starred</v-list-item-title>
                </v-list-item>
                <v-list-item link to="/templates">
                    <v-list-item-icon>
                        <v-icon>mdi-file-document</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Templates</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- <v-app-bar app>
            <v-app-bar-title>
                <router-link to="/" custom v-slot="{ navigate }" style="cursor: pointer">
                    <span @click="navigate">Python BPMN engine Admin v1.0</span>
                </router-link>
            </v-app-bar-title>
        </v-app-bar> -->

        <!-- Sizes your content based upon application components -->
        <v-main :class="{templateBuilderContainer: isTemplateEngineRoute}">
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-main>

        <v-footer app>
            <!-- -->
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    components: {},

    data: () => ({
        //
    }),

    computed:{
        isTemplateEngineRoute(){
            const route = this.$route.name;
            return route == "templates-create" || route == "templates-edit";
        }
    }
};
</script>
<style lang="scss">
.bjs-container {
    .user_task:not(.djs-connection) {
        .djs-visual > :nth-child(1) {
            fill: lightgray !important;
        }

        cursor: pointer !important; /* color elements as green */
    }
    .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
        fill: yellow !important; /* color elements as green */
    }
}

// stretches the content to the full width and height of the screen
main.templateBuilderContainer{
    .v-main__wrap{
        display: flex;
        align-items: stretch;

        .container{
            display: flex;
            align-items: stretch;

            padding: 0;
        }
    }
}

</style>
