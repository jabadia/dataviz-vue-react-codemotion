<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/sector">Sector</router-link> |
            <router-link to="/responsive">Responsive</router-link> |
            <router-link to="/responsive-resizing">Responsive (resizing)</router-link> |
            <router-link to="/responsive-full">Responsive (full)</router-link> |
            <router-link to="/interpolation">Interpolation</router-link> |
            <router-link to="/view-box">ViewBox</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <router-view/>
    </div>
</template>

<style>
    html {
        font-family: Helvetica, sans-serif;
    }
    #nav {
        height: 2em;
        color: #ccc;

    }
    #nav a:link {
        color: #ccc;
    }
    #nav a:visited {
        color: #ccc;
    }
</style>
