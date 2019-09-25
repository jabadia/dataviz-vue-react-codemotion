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
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        }, {
            path: '/sector',
            name: 'sector',
            component: () => import('./views/PacMan.vue'),
        }, {
            path: '/responsive',
            name: 'responsive',
            component: () => import('./views/ResponsiveSimple.vue'),
        }, {
            path: '/responsive-resizing',
            name: 'responsive-resizing',
            component: () => import('./views/ResponsiveResizing.vue'),
        }, {
            path: '/responsive-full',
            name: 'responsive-full',
            component: () => import('./views/ResponsiveFull.vue'),
        }, {
            path: '/interpolation',
            name: 'interpolation',
            component: () => import('./views/Interpolation.vue'),
        }, {
            path: '/view-box',
            name: 'viewbox',
            component: () => import('./views/ViewBox.vue'),
        },
    ],
});
