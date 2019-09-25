<template>
    <div id="app">
        <label><input type="checkbox" v-model="slowMotion"> slow motion</label>
        <hemiciclo-chart-dd :current-data="currentData" :previous-data="previousData" :show-current="showCurrent" :duration="duration"/>
        <hemiciclo-chart :current-data="currentData" :previous-data="previousData" :show-current="showCurrent" :duration="duration"/>
        <button :class="{'an-enabled': !showCurrent}" @click="showCurrent=false">2011</button>
        <button :class="{'an-enabled': showCurrent}" @click="showCurrent=true">2016</button>
        <section class="an-tables">
            <!--
            <results-table :candidaturas="previousData.candidaturas"/>
            <results-table :candidaturas="currentData.candidaturas"/>
            -->
            <animated-table :candidaturas="showCurrent ? currentData.candidaturas : previousData.candidaturas"/>
        </section>
    </div>
</template>

<script>
    import axios from 'axios';
    import HemicicloChart from './components/HemicicloChart';
    import HemicicloChartDd from './components/HemicicloChartDd';
    import ResultsTable from './components/ResultsTable';
    import AnimatedTable from './components/AnimatedTable';

    export default {
        name: 'app',
        data() {
            return {
                currentData: {},
                previousData: {},
                showCurrent: true,
                slowMotion: false,
            };
        },
        computed: {
            duration() {
                return this.slowMotion ? 5.0 : 1.0;
            },
        },
        methods: {
            loadData() {
                axios.get('/2011/congreso.json')
                    .then(response => response.data)
                    .then(data => {
                        this.previousData = data;
                    });
                axios.get('/2016/congreso.json')
                    .then(response => response.data)
                    .then(data => {
                        this.currentData = data;
                    });
            },
        },
        mounted() {
            this.loadData();
        },
        components: {
            HemicicloChart,
            HemicicloChartDd,
            ResultsTable,
            AnimatedTable,
        },
    };
</script>

<style lang="less">
    html {
        font-family: Helvetica;
    }

    #app {
        width: 400px;
        margin: 0 auto;
    }

    section.an-tables {
        display: flex;
    }

    button {
        border-radius: 0;
        font-size: 15px;
        margin: 15px 0px;
    }

    .an-enabled {
        background: gray;
        color: white;
    }
</style>
