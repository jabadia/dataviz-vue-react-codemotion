<template>
    <div id="app">
        <nav>
            <a href="/0d3_as_is.html">d3 original</a> |
            <router-link to="/vue-sankey">componente</router-link> |
            <router-link to="/vue-sankey2">componente integrado</router-link>
        </nav>
        <router-view/>
    </div>
</template>

<style>
    #app {
        margin: 0 100px;
    }
    button {
        font-size: 14px;
    }
</style>
