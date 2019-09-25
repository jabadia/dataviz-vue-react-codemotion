<template>
    <div class="about">
        <h1>Sankey Chart en un componente Vue</h1>
        <div id="chart"></div>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import 'd3.chart';
    import 'd3.chart.sankey';

    export default {
        name: 'vue-sankey',
        methods: {
            renderChart() {
                d3.json('//cdn.rawgit.com/q-m/d3.chart.sankey/master/example/data/energy.json', function (json) {
                    const chart = d3.select('#chart').append('svg').chart('Sankey'),
                        color = d3.scale.category20();

                    chart
                        .nodeWidth(15)
                        .nodePadding(10)
                        .colorNodes(function (name) {
                            return color(name.replace(/ .*/, ''));
                        })
                        .draw(json);
                });
            },
        },
        mounted() {
            this.renderChart();
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
