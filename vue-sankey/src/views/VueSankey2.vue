<template>
    <div class="vue-sankey2">
        <h1>Sankey Chart en un componente Vue (integrado)</h1>
        <div style="margin-bottom: 20px;">
            highlight: <input type="text" v-model="highlightText">
        </div>
        <div id="chart" ref="theChart"></div>
        <button @click="renderChart">render</button>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import 'd3.chart';
    import 'd3.chart.sankey';

    export default {
        name: 'vue-sankey2',
        data: () => ({
            highlightText: undefined,
            energyData: undefined,
        }),
        computed: {
        },
        watch: {
            energyData() {
                this.renderChart();
            },
            highlightText() {
                this.renderChart();
            },
        },
        methods: {
            downloadData() {
                console.log('downloading');
                fetch('//cdn.rawgit.com/q-m/d3.chart.sankey/master/example/data/energy.json')
                    .then(response => response.json())
                    .then(json => {
                        this.energyData = json;
                    });
            },
            renderChart() {
                if (!this.energyData) {
                    return;
                }
                console.log('rendering');

                // needed because the draw() method modifies the original JSON we pass in and
                // creates circular structures that cause errors if we try to do anything with it
                // (console.log, inspect in Vue DevTools or render in the template as JSON)
                const deepCloneEnergyData = JSON.parse(JSON.stringify(this.energyData));
                const lowerHighlightText = this.highlightText && this.highlightText.toLowerCase();

                // cleanup previously rendered chart
                d3.select(this.$refs.theChart).select('svg').remove();

                const chart = d3.select(this.$refs.theChart).append('svg').chart('Sankey'),
                    color = d3.scale.category20();

                chart
                    .nodeWidth(15)
                    .nodePadding(10)
                    .colorNodes(function (name) {
                        return color(name.replace(/ .*/, ''));
                    })
                    .colorLinks(function(link) {
                        if (!lowerHighlightText)
                            return;
                        if (link.source.name.toLowerCase().indexOf(lowerHighlightText) !== -1)
                            return 'orange';
                        if (link.target.name.toLowerCase().indexOf(lowerHighlightText) !== -1)
                            return 'green';
                    })
                    .on('node:mouseover', node => { this.highlightText = node.name; })
                    .on('node:mouseout', () => { this.highlightText = ''; })
                    .draw(deepCloneEnergyData);
            },
        },
        mounted() {
            this.downloadData();
        },
    };
</script>

<style>
    #chart {
        width: calc(100% - 40px);
        height: 80vh;
    }

    .node rect {
        fill-opacity: .9;
        shape-rendering: crispEdges;
    }

    .node text {
        pointer-events: none;
        text-shadow: 0 1px 0 #fff;
    }

    .link {
        fill: none;
        stroke: #000;
        stroke-opacity: .2;
    }

    .link:hover {
        stroke-opacity: .5;
    }

</style>
