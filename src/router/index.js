import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchInstances from '../views/SearchInstances.vue';
import ProcessInstance from '../views/ProcessInstance.vue';
import Models from '../views/Models.vue';

import templateBuilder from '../views/templateBuilder.vue';
import templates from '../views/templates.vue';

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
        path: '/templates/createTemplate',
        name: '/templates/createTemplate',
        component: templateBuilder,
    },
    {
        path: '/templates',
        name: 'templates',
        component: templates,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
