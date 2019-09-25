<template>
    <svg ref="root" class="stacked-bar-plot" :width="container.width" :height="container.height" :viewBox="[0,0,container.width,container.height].join(' ')">
        <g :transform="`translate(${margin.left + 0.5},${margin.top + 0.5})`">
            <g class="axis-x" :transform="`translate(0,${area.height})`"></g>
            <g class="axis-y"></g>
            <g class="grid"></g>
            <g class="series "></g>
        </g>
    </svg>
</template>

<script>
    import * as d3 from '@/d3Bundle';
    import { formatMoney } from '../filters/numbers';

    export default {
        name: 'stacked-bar-plot',
        props: {
            movies: Array,
            allStudios: Array,
            allYears: Array,
            colors: Function,
            animationDuration: Number,
        },
        data: () => ({
            container: {
                width: 600,
                height: 600,
            },
            margin: {
                top: 10,
                right: 10,
                bottom: 30,
                left: 55,
            },
        }),
        computed: {
            area() {
                return {
                    width: this.container.width - this.margin.left - this.margin.right,
                    height: this.container.height - this.margin.top - this.margin.bottom,
                };
            },
        },
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
                if (!this.movies) {
                    return;
                }

                // data preparation
                const byYearAndStudio = Object.values(this.movies.reduce((byYearAndStudio, movie) => {
                    const year = movie.date.getFullYear();
                    if (byYearAndStudio[year] === undefined) {
                        byYearAndStudio[year] = { year };
                    }
                    byYearAndStudio[year][movie.studio] = (byYearAndStudio[year][movie.studio] || 0) + movie.opening;
                    return byYearAndStudio;
                }, {}));

                const stack = d3.stack()
                    .keys(this.allStudios)
                    .value((d, key) => d[key] || 0);

                const series = stack(byYearAndStudio);

                // scales
                const x = d3.scaleBand()
                    .domain(this.allYears)
                    .range([0, this.area.width])
                    .padding(0.2);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(series, serie => d3.max(serie, d => d[1]))])
                    .range([this.area.height, 0]);

                // axis
                const root = d3.select(this.$refs.root);
                root.select('.axis-x')
                    .call(d3.axisBottom(x)).selectAll('text')
                    .attr('transform', 'rotate(-45)')
                    .attr('dx', '-1em');
                root.select('.axis-y')
                    .transition().duration(this.animationDuration)
                    .call(d3.axisLeft(y).tickFormat(formatMoney));

                // series
                const seriesWithData = root.select('.series').selectAll('g.serie').data(series, serie => serie.key);

                // ENTER
                const seriesEnter = seriesWithData.enter().append('g')
                    .attr('class', 'serie')
                    .style('fill', (d, i) => this.colors(this.allStudios[i]));

                // UPDATE
                const seriesUpdate = seriesWithData.merge(seriesEnter);

                const rectWithData = seriesUpdate.selectAll('rect').data(serie => serie, d => d.data.year);

                const rectEnter = rectWithData.enter().append('rect')
                    .attr('x', d => x(d.data.year))
                    .attr('y', y(0)) // d => y(d[0]))
                    .attr('width', x.bandwidth())
                    .attr('height', 0)
                    .on('mouseenter', (d, i, nodes) => {
                        // look in parent's data
                        const studio = d3.select(nodes[i].parentNode).datum().key;
                        this.$emit('hover-year', d.data.year, studio);
                    })
                    .on('mouseleave', (d) => {
                        this.$emit('hover-year', undefined);
                    });

                const rectUpdate = rectWithData.merge(rectEnter);

                rectUpdate
                    .transition().duration(this.animationDuration)
                    .attr('x', d => x(d.data.year))
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(d[1]))
                    .attr('height', d => y(d[0]) - y(d[1]));

                rectWithData.exit().remove();

                // EXIT
                seriesWithData.exit().remove();

                // grid
                const ticks = y.ticks(8);
                const gridLines = root.select('g.grid')
                    .selectAll('line').data(ticks, tick => tick);

                const gridLinesEnter = gridLines.enter()
                    .append('line')
                    .attr('x1', 0)
                    .attr('y1', tick => y(tick))
                    .attr('x2', this.area.width)
                    .attr('y2', tick => y(tick))
                    .style('opacity', 0);

                gridLines.merge(gridLinesEnter)
                .transition()
                    .duration(this.animationDuration)
                    .attr('y1', tick => y(tick))
                    .attr('y2', tick => y(tick))
                    .style('opacity', 1);

                gridLines.exit().transition()
                    .style('opacity', 0)
                    .remove();
            },
        },
        mounted() {
            this.renderViz();
        },
    };
</script>

<style>
    svg.stacked-bar-plot {
        background: #eee;
        width: 600px;
        height: 600px;
        font-family: sans-serif;
        font-size: 0.8rem;
    }
    svg.stacked-bar-plot .grid line {
        fill: none;
        stroke: #888;
        shape-rendering: crispEdges;
    }

    svg.stacked-bar-plot .serie rect {
        opacity: 0.8;
    }
    svg.stacked-bar-plot .serie rect:hover {
        opacity: 1;
    }
</style>
