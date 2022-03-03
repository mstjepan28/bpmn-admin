import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchInstances from '../views/SearchInstances.vue';
import ProcessInstance from '../views/ProcessInstance.vue';
import Models from '../views/Models.vue';

import templates from '../views/templates.vue';
import templatesCreate from '../views/createTemplate.vue';
import templatesEdit from '../views/editTemplate.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/models',
        name: 'models',
        component: Models,
    },
    {
        path: '/instances/:id',
        name: 'instance',
        component: ProcessInstance,
        props: true,
    },
    {
        path: '/instances',
        name: 'instances',
        component: SearchInstances,
    },
    {
        path: '/templates',
        name: 'templates',
        component: templates,
    },
    {
        path: '/templates/create',
        name: 'createTemplate',
        component: templatesCreate,
    },
    {
        path: '/templates/edit/:templateId',
        name: 'editTemplate',
        component: templatesEdit,
    },

];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
