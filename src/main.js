import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

import router from './router';
import pv from './components/ProcessVariables.vue';

import 'vuetify/dist/vuetify.min.css';

import VueX from "vuex"; 
Vue.use(VueX)

import templateEngineStore from './templateEngine/store/templateEngineStore';
const store = new VueX.Store({
    modules: {
        templateEngineStore,
    }
});

Vue.config.productionTip = false;

Vue.component('process-variables', pv);

new Vue({
    store,
    vuetify,
    router,
    render: (h) => h(App),
}).$mount('#app');
