<template>
    <div class="responsive">
        <a href="https://blog.datawrapper.de/weekly-chart-industrial-revolution/">original</a>
        <svg
            :width="container.width"
            :height="container.height"
            :viewBox="[0, 0, container.width, container.height].join(' ')"
            :class="breakpoint"
        >
            <g ref="root" :transform="`translate(${margin.left},${margin.top})`">
                <g class="grid"></g>
                <g class="axis"></g>
                <g class="lines">
                    <path v-for="serie in series" :key="serie.key" :d="serie.path" :stroke="serie.color"></path>
                </g>
                <g class="annotations" v-if="lifeExpectancy && breakpoint !== 'sm'">
                    <g v-for="annotation in annotations"
                       :key="annotation.label0"
                    >
                        <g :transform="`translate(${xScale(annotation.x1)}, ${yScale(annotation.y1)})`">
                            <text :fill="annotation.color" dx="0.5em" dy="1.2em">{{annotation.label0}}</text>
                            <text :fill="annotation.color" dx="0.5em" dy="2.4em">{{annotation.label1}}</text>
                        </g>
                        <line
                            :x1="xScale(annotation.x1)" :y1="yScale(annotation.y1)"
                            :x2="xScale(annotation.x2)" :y2="yScale(annotation.y2)"
                            :stroke="annotation.color"
                        ></line>
                    </g>
                </g>
            </g>
        </svg>
        <div class="legend" v-if="lifeExpectancy && breakpoint === 'sm'">
            <ul>
                <li v-for="annotation in annotations" :key="annotation.label0" :style="{color: annotation.color}">
                    <div class="legend-symbol" :style="{background: annotation.color}"></div>
                    {{annotation.label0}} {{annotation.label1}}
                </li>
            </ul>
        </div>
        {{container.width}}
        {{breakpoint}}
    </div>
</template>

<script>
    import * as d3 from '@/d3Bundle';

    export default {
        data: () => ({
            container: {
                width: 0,
                height: 0,
            },
            // margin: {
            //     top: 20,
            //     bottom: 40,
            //     left: 40,
            //     right: 30,
            // },
            seriesConfig: {
                lifeExpectancy: { label: 'Life expectancy at birth', color: 'rgb(0, 112, 68)' },
                notPoorPercent: { label: '% not living in extreme poverty', color: 'rgb(0, 220, 166)' },
                democracyPercent: { label: '% living in a democracy', color: 'rgb(154, 154, 154)' },
            },
            aspectRatio: 0.6,
        }),
        computed: {
            breakpoint() {
                const breakpoints = [
                    { name: 'sm', minWidth: 0 },
                    { name: 'md', minWidth: 320 },
                    { name: 'lg', minWidth: 640 },
                ];
                return breakpoints[d3.bisector(d => d.minWidth).right(breakpoints, this.container.width) - 1].name;
            },
            margin() {
                return this.breakpoint === 'sm'
                    ? { top: 10, bottom: 10, left: 10, right: 10 }
                    : { top: 20, bottom: 40, left: 30, right: 40 };
            },
            renderDependencies() {
                return [
                    // this.breakpoint,
                    this.container.width,
                    this.lifeExpectancy,
                ];
            },
            area() {
                return {
                    height: this.container.height - this.margin.top - this.margin.bottom,
                    width: this.container.width - this.margin.left - this.margin.right,
                };
            },
            xScale() {
                return d3.scaleLinear()
                    .domain(d3.extent(this.lifeExpectancy, d => d.year))
                    .range([0, this.area.width]);
            },
            yScale() {
                return d3.scaleLinear()
                    .domain([0, 80])
                    .range([this.area.height, 0]);
            },
            series() {
                if (!this.lifeExpectancy) {
                    return [];
                }

                return Object.keys(this.seriesConfig).map(key => ({
                    key,
                    name: this.seriesConfig[key].label,
                    color: this.seriesConfig[key].color,
                    path: d3.line()
                        .x(d => this.xScale(d.year))
                        .y(d => this.yScale(d[key]))
                        .curve(d3.curveMonotoneX)(this.lifeExpectancy),
                }));
            },
            annotations() {
                const evalSerie = (x, over, result) => {
                    return d3.scaleLinear()
                        .domain(this.lifeExpectancy.map(d => d[over]))
                        .range(this.lifeExpectancy.map(d => d[result]))(x);
                };

                const posAnnotation1 = d3.scaleLinear().domain([300, 500]).range([1300, 1500]).clamp(true);
                const posAnnotation2 = d3.scaleLinear().domain([300, 500]).range([1400, 1600]).clamp(true);

                return [
                    {
                        x1: 1100, y1: 40,
                        x2: 1100, y2: evalSerie(1100, 'year', 'lifeExpectancy'),
                        color: this.seriesConfig['lifeExpectancy'].color,
                        label0: 'Life Expectancy',
                        label1: 'at Birth',
                    },
                    {
                        x1: posAnnotation1(this.area.width), y1: 15,
                        x2: evalSerie(15, 'democracyPercent', 'year'), y2: 15,
                        color: this.seriesConfig['democracyPercent'].color,
                        label0: 'Percentage of people',
                        label1: 'living in democracy',
                    },
                    {
                        x1: posAnnotation2(this.area.width), y1: 65,
                        x2: evalSerie(65, 'notPoorPercent', 'year'), y2: 65,
                        color: this.seriesConfig['notPoorPercent'].color,
                        label0: 'Percentage of people not',
                        label1: 'living in extreme poverty',
                    },
                ];
            },
        },
        asyncComputed: {
            async lifeExpectancy() {
                return d3.csv('/data/life-expectancy.csv', (row) => ({
                    year: +row['Year'],
                    lifeExpectancy: +row['Life expectancy at birth'],
                    notPoorPercent: +row['% not living in extreme poverty'],
                    democracyPercent: +row['% living in a democracy'],
                }));
            },
        },
        watch: {
            renderDependencies(newValues, oldValues) {
                if ((newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) && newValues[1] !== null) {
                    this.renderChart();
                }
            },
        },
        methods: {
            onResize() {
                Object.assign(this.container, {
                    width: this.$el.offsetWidth - 15,
                    height: this.$el.offsetWidth * this.aspectRatio, //this.$el.offsetHeight,
                });
            },
            renderChart() {
                const root = d3.select(this.$refs.root);
                root.select('.grid')
                    .attr('transform', `translate(${this.area.width},0)`)
                    .call(
                        d3.axisRight(this.yScale)
                            .tickSize(-this.area.width)
                    );

                root.select('.axis')
                    .attr('transform', `translate(0, ${this.area.height})`)
                    .call(
                        d3.axisBottom(this.xScale)
                            .ticks(this.area.width / 80)
                            .tickFormat(d => d)
                    );
            },
        },
        mounted() {
            this.$nextTick(this.onResize);
            // https://github.com/Akryum/vue-resize
            this.$el.ownerDocument.defaultView.addEventListener('resize', this.onResize);
        },
        destroyed() {
            this.$el.ownerDocument.defaultView.removeEventListener('resize', this.onResize);
        },
    };
</script>

<style>
    .responsive {
        width: 100%;
        /*height: 100%;*/
    }

    .responsive svg {
        background: #fafafa;
    }

    .responsive svg .lines path {
        fill: none;
        stroke-width: 3px;
    }

    .responsive svg .axis line {
        stroke: none;
    }

    .responsive svg .axis path {
        stroke: #888;
        stroke-opacity: 0.7;
        shape-rendering: crispEdges;
    }

    .responsive svg .axis text {
        font-size: 14px;
        fill: #888;
    }
    .responsive svg .grid line {
        stroke: lightgrey;
        stroke-opacity: 0.7;
        shape-rendering: crispEdges;
    }
    .responsive svg .grid path {
        stroke: none;
    }
    .responsive svg .grid text {
        font-size: 14px;
        fill: #888;
    }
    .responsive svg.sm .grid text,
    .responsive svg.sm .axis text {
        display: none;
    }

    .responsive svg .annotations rect {
        fill: white;
        opacity: 0.5;
    }
    .responsive svg .annotations text {
        font-family: Helvetica;
        font-size: 1rem;
    }
    .responsive svg.md .annotations text {
        font-size: 0.8rem;
    }
    .responsive svg .annotations line {
        stroke-width: 1.5px;
        stroke-dasharray: 14 4;
    }
    .legend {
        font-family: Helvetica;
        font-size: 14px;
    }
    .legend ul {
        padding: 0;
        list-style: none;
    }
    .legend-symbol {
        display: inline-block;
        height: 3px;
        width: 20px;
        vertical-align: middle;
    }
</style>
