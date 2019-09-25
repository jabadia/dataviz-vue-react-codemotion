<template>
    <svg ref="root" class="circular-bar-plot">
        <g :transform="`translate(${this.container.width / 2},${this.container.height / 2})`">
            <g class="grid"></g>
            <g class="series"></g>
            <g class="labels"></g>
        </g>
    </svg>
</template>

<script>
    import * as d3 from '@/d3Bundle';
    import { formatMoney } from '../filters/numbers';
    import { MONTH_NAMES } from '../filters/dates';

    const RAD_TO_DEG = 180.0 / Math.PI;

    export default {
        name: 'circular-bar-plot',
        props: {
            movies: Array,
            allStudios: Array,
            allYears: Array,
            colors: Function,
            animationDuration: Number,
        },
        data() {
            return {
                container: {
                    width: 600,
                    height: 600,
                },
                margin: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                },
            };
        },
        computed: {},
        watch: {
            movies: {
                immediate: true,
                handler: function () {
                    this.renderViz();
                },
            },
        },
        methods: {
            renderViz() {
                const innerRadius = 100;
                const outerRadius = 300;

                if (!this.movies) {
                    return;
                }

                // data preparation
                const byMonthAndStudio = Object.values(this.movies.reduce((byMonthAndStudio, movie) => {
                    const month = movie.date.getMonth();
                    if (byMonthAndStudio[month] === undefined) {
                        byMonthAndStudio[month] = { month };
                    }
                    byMonthAndStudio[month][movie.studio] = (byMonthAndStudio[month][movie.studio] || 0) + movie.opening;
                    return byMonthAndStudio;
                }, {}));

                if (!this.movies) {
                    return;
                }

                const stack = d3.stack()
                    .keys(this.allStudios)
                    .value((d, key) => d[key] || 0);

                const seriesStack = stack(byMonthAndStudio);

                // scales
                const x = d3.scaleBand()
                    .domain(d3.range(0, 12))
                    .range([0, 2 * Math.PI])
                    .align(0); // to put padding after the bands

                const y = d3.scaleLinear()  // replace by scaleRadial
                    .domain([0, d3.max(seriesStack, serie => d3.max(serie, d => d[1]))])
                    .range([innerRadius, outerRadius]);

                const series = seriesStack.map(serie => serie.map(d => ({
                    inner: y(d[0] || 0),
                    outer: y(d[1] || 0),
                    month: d.data.month,
                    studio: serie.key,
                })));

                // series
                const root = d3.select(this.$refs.root);
                const seriesWithData = root.select('.series').selectAll('g.serie').data(series);

                // ENTER
                const seriesEnter = seriesWithData.enter().append('g')
                    .attr('class', 'serie')
                    .style('fill', (d, i) => this.colors(this.allStudios[i]));

                // UPDATE
                const arc = d3.arc()
                    .innerRadius(d => d.inner)
                    .outerRadius(d => d.outer)
                    .startAngle(d => x(d.month))
                    .endAngle(d => x(d.month) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius);

                function arcTween(d) {
                    const initial = this._initial || { inner: y(0), outer: y(0), month: d.month, studio: d.studio };
                    const interpolate = d3.interpolateObject(initial, d);
                    this._initial = interpolate(0);
                    return t => arc(interpolate(t));
                }

                const seriesUpdate = seriesWithData.merge(seriesEnter)
                    .style('fill', (d, i) => this.colors(this.allStudios[i]));

                const pathWithData = seriesUpdate.selectAll('path').data(serie => serie, d => d.month);

                const pathEnter = pathWithData.enter().append('path')
                    .attr('d', d => arc({
                        inner: y(0),
                        outer: y(0),
                        month: d.month,
                        studio: d.studio,
                    }))
                    .on('mouseenter', (d) => {
                        this.$emit('hover-month', d.month, d.studio);
                    })
                    .on('mouseleave', (d) => {
                        this.$emit('hover-month', undefined);
                    });

                const pathUpdate = pathWithData.merge(pathEnter);

                pathUpdate
                    .transition().duration(this.animationDuration)
                    .attrTween('d', arcTween);

                // EXIT
                pathWithData.exit().remove();

                // EXIT
                seriesWithData.exit().remove();

                this.renderLabels(root, x, innerRadius);
                this.renderGrid(root, y);
            },
            renderGrid(root, y) {
                const ticks = y.ticks(5);
                const gridLines = root.select('g.grid')
                    .selectAll('circle').data(ticks, tick => tick);

                const gridLinesEnter = gridLines.enter()
                    .append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', tick => y(tick))
                    .style('opacity', 0);

                gridLines.merge(gridLinesEnter)
                    .transition().duration(this.animationDuration / 2)
                    .attr('r', tick => y(tick))
                    .transition().duration(this.animationDuration / 2)
                    .style('opacity', 1);

                gridLines.exit().transition()
                    .style('opacity', 0)
                    .remove();

                const gridLabels = root.select('g.grid')
                    .selectAll('text').data(ticks, tick => tick);
                const gridLabelsEnter = gridLabels.enter()
                    .append('text')
                    .attr('x', 0)
                    .attr('y', tick => -y(tick))
                    .attr('dy', -5)
                    .attr('text-anchor', 'middle')
                    .style('opacity', 0)
                    .text(tick => formatMoney(tick));

                gridLabels.merge(gridLabelsEnter)
                    .transition().duration(this.animationDuration / 2)
                    .attr('y', tick => -y(tick))
                    .text(tick => formatMoney(tick))
                    .transition().duration(this.animationDuration / 2)
                    .style('opacity', 1);
                gridLabels.exit().remove();
            },
            renderLabels(root, x, innerRadius) {
                const labels = root.select('g.labels')
                    .selectAll('text.label').data(MONTH_NAMES);

                labels.enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('transform', (m, i) => `rotate(${(x(i) + x.bandwidth() / 2 - Math.PI / 2) * RAD_TO_DEG})`)
                    .attr('x', innerRadius - 10)
                    .attr('text-anchor', 'end')
                    .text(m => m);
                labels.exit().remove();
            },
        },
        mounted() {
            this.renderViz();
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    svg.circular-bar-plot {
        background: #eee;
        width: 600px;
        height: 600px;
        font-family: sans-serif;
        font-size: 0.8rem;
    }

    .circular-bar-plot .grid circle {
        fill: none;
        stroke: #888;
    }

    .circular-bar-plot .grid text {
        fill: #888;
    }
</style>
