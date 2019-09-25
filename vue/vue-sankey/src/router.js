import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        }, {
            path: '/vue-sankey',
            name: 'vue-sankey',
            component: () => import(/* webpackChunkName: "vue-sankey" */ './views/VueSankey.vue'),
        }, {
            path: '/vue-sankey2',
            name: 'vue-sankey2',
            component: () => import(/* webpackChunkName: "vue-sankey2" */ './views/VueSankey2.vue'),
        },
    ],
});
