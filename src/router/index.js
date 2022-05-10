import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchInstances from '../views/SearchInstances.vue';
import ProcessInstance from '../views/ProcessInstance.vue';
import Models from '../views/Models.vue';

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

    // TEMPLATE ENGINE ROUTES
    {
        path: '/templates',
        name: 'templates',
        component: () => import("../templateEngine/views/Templates.vue"),
    },
    {
        path: '/templates/create',
        name: 'templates-create',
        component: () => import("../templateEngine/views/TemplateCreate.vue"),
    },
    {
        path: '/templates/edit/:templateId',
        name: 'templates-edit',
        component: () => import("../templateEngine/views/TemplateEdit.vue"),
    },

];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
