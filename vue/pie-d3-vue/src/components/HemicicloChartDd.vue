<template>
    <div class="an-chart-wrapper-dd">
        <svg class="an-hemiciclo-chart-dd"></svg>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    // const asDeg = rad => rad / Math.PI * 180;

    export default {
        name: 'hemiciclo-chart-dd',
        props: {
            currentData: Object,
            previousData: Object,
            showCurrent: Boolean,
            duration: { type: Number, default: 1.0 },
        },
        data() {
            return {
                width: 400,
                height: 200,
            };
        },
        watch: {
            candidaturasWithEscanos() {
                this.renderChart();
            },
        },
        computed: {
            candidaturas() {
                return this.showCurrent
                    ? this.currentData && this.currentData.candidaturas
                    : this.previousData && this.previousData.candidaturas;
            },
            candidaturasWithEscanos() {
                return this.candidaturas && this.candidaturas.filter(c => c.iEscanos !== 0);
            },
            sectors() {
                return this.candidaturasWithEscanos && this.pie(this.candidaturasWithEscanos);
            },
            pie() {
                const options = {
                    additionalAngle: -Math.PI * 0.04,
                };
                return d3.pie()
                    .startAngle(-Math.PI / 2 - options.additionalAngle)
                    .endAngle(Math.PI / 2 + options.additionalAngle)
                    .padAngle(Math.PI / 180.0 * 0.2)
                    .value(d => d.iEscanos)
                    .sort(null);
            },
        },
        methods: {
            renderChart() {
                console.log('rendering');
                const svg = d3.select('svg.an-hemiciclo-chart-dd');
                svg
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .attr('viewBox', [0, 0, this.width, this.height].join(' '));

                let g = svg.selectAll('g.an-pie').data([1]);
                const gEnter = g.enter().append('g')
                    .attr('class', 'an-pie')
                    .attr('transform', `translate(${this.width / 2},${this.height})`);
                g = g.merge(gEnter);

                const additionalAngle = -Math.PI * 0.04;
                const pie = d3.pie()
                    .startAngle(-Math.PI / 2 - additionalAngle)
                    .endAngle(Math.PI / 2 + additionalAngle)
                    .padAngle(Math.PI / 180.0 * 0.2)
                    .value(d => d.iEscanos)
                    .sort(null);

                const arcSector = d3.arc()
                    .innerRadius(50)
                    .outerRadius(200);

                const arcLabel = d3.arc()
                    .innerRadius(125)
                    .outerRadius(175);

                const sectors = g.selectAll('g.an-sector').data(pie(this.candidaturasWithEscanos || []), d => d.data.sCandidaturaUnificada);

                console.log({update: sectors.size(), enter: sectors.enter().size(), exit: sectors.exit().size()});

                // ENTER
                const sectorsEnter = sectors.enter()
                    .append('g')
                        .attr('class', 'an-sector');
                sectorsEnter
                    .append('path');
                sectorsEnter // .filter(d => d.data.iEscanos > 10)
                    .append('text');

                const sectorsUpdate = sectors.merge(sectorsEnter);

                // UPDATE
                sectorsUpdate
                    .attr('class', d => `an-sector sector-${d.data.sCandidaturaUnificada}`);
                sectorsUpdate.select('path')
//                    .attr('d', d => arcSector(d));
                    .transition()
                        .duration(this.duration * 1000)
                        .ease(d3.easeCubicOut)
                        .attrTween('d', function (d) { // can't use fat arrow functions here, we need access to 'this'
                            this._current = this._current || { startAngle: 0, endAngle: 0 };
                            const is = d3.interpolate(this._current.startAngle, d.startAngle);
                            const ie = d3.interpolate(this._current.endAngle - this._current.startAngle, d.endAngle - d.startAngle);
                            Object.assign(this._current, d); // keep for next transition
                            return function (t) {
                                d.startAngle = is(t);
                                d.endAngle = d.startAngle + ie(t);
                                return arcSector(d);
                            };
                        });
                sectorsUpdate.select('text')
                    // .attr('x', d => arcLabel.centroid(d)[0])
                    // .attr('y', d => arcLabel.centroid(d)[1])
                    // .text(d => d.data.iEscanos);
                .transition()
                    .duration(this.duration * 1000)
                    .ease(d3.easeCubicOut)
                    .tween('label', function(d) { // can't use fat arrow functions here, we need access to 'this'
                        this._current = this._current || { startAngle: 0, endAngle: 0, iEscanos: 0 };
                        const is = d3.interpolate(this._current.startAngle, d.startAngle);
                        const ie = d3.interpolate(this._current.endAngle - this._current.startAngle, d.endAngle - d.startAngle);
                        const il = d3.interpolate(this._current.iEscanos, d.data.iEscanos);
                        Object.assign(this._current, { // keep for next transition
                            startAngle: d.startAngle,
                            endAngle: d.endAngle,
                            iEscanos: d.data.iEscanos,
                        });
                        const labelNode = d3.select(this);
                        return function (t) {
                            d.startAngle = is(t);
                            d.endAngle = d.startAngle + ie(t);
                            const label = Math.floor(il(t));
                            const centroid = arcLabel.centroid(d);
                            labelNode.attr('x', centroid[0]);
                            labelNode.attr('y', centroid[1]);
                            labelNode.text(label >= 10 ? label : '');
                        };
                    });

                // EXIT
                sectors.exit()
                    .transition()
                    .duration(this.duration * 1000 / 2)
                    .style('opacity', 0)
                .remove();
            },
        },
        mounted() {
            this.renderChart();
        },
    };
</script>

<style lang="less">
    @import (reference) 'colors';

    .an-chart-wrapper-dd {
        position: relative;

        .an-hemiciclo-chart-dd {
            display: block;
        }
    }

    .fg-sinasignar  { color: @sinasignar; }
    .fg-otros       { color: @otros;      }
    .fg-pp          { color: @pp;         }
    .fg-psoe        { color: @psoe;       }
    .fg-ciudadanos  { color: @ciudadanos; }
    .fg-podemos     { color: @podemos;    }
    .fg-podemos-iu  { color: @podemos;    }
    .fg-iu          { color: @iu;         }
    .fg-pnv         { color: @pnv;        }
    .fg-upyd        { color: @upyd;       }
    .fg-ciu         { color: @ciu;        }
    .fg-amaiur      { color: @amaiur;     }
    .fg-bildu       { color: @bildu;      }
    .fg-ccanaria    { color: @ccanaria;   }
    .fg-bng         { color: @bng;        }
    .fg-gbai        { color: @gbai;       }
    .fg-esquerra    { color: @esquerra;   }
    .fg-compromis   { color: @compromis;  }
    .fg-fac         { color: @fac;        }

</style>
