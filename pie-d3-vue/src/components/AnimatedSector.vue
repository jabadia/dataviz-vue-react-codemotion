<template>
    <g class="an-sector"
       :class="`sector-${candidatura.sCandidaturaUnificada} ${anHover? 'an-hover':''}`">
        <path
            :d='arc(animatedSector)'
            @mousemove="mousemove"
            @mouseout="mouseout"
        ></path>
        <text v-if="animatedLabel > 10" :x="centroid[0]" :y="centroid[1]">
            {{animatedLabel|formatNumber}}
        </text>
    </g>
</template>

<script>
    import * as d3 from 'd3';
    import TweenLite from 'gsap';

    export default {
        props: {
            sector: Object,
            tooltip: Object,
            duration: {
                type: Number,
                default: 0.5,
            },
        },
        data() {
            return {
                animatedSector: {
                    startAngle: 0,
                    endAngle: 0,
                    padAngle: 0,
                },
                animatedLabel: 0,
                anHover: false,
            };
        },
        watch: {
            sector: {
                immediate: true,
                handler(newSector) {
                    TweenLite.to(this.animatedSector, this.duration, {
                        startAngle: newSector.startAngle,
                        endAngle: newSector.endAngle,
                        padAngle: newSector.padAngle,
                    });
                    TweenLite.to(this.$data, this.duration, {
                        animatedLabel: newSector.data.iEscanos,
                    });
                },
            },
        },
        computed: {
            candidatura() {
                return this.sector.data;
            },
            arc() {
                return d3.arc()
                    .innerRadius(50)
                    .outerRadius(200);
            },
            arcLabels() {
                return d3.arc()
                    .innerRadius(125)
                    .outerRadius(175);
            },
            centroid() {
                return this.arcLabels.centroid(this.animatedSector);
            },
        },
        methods: {
            mousemove(ev) {             // TODO: mixin for tooltip functionality
                this.anHover = true;

                if (!this.tooltip)
                    return;

                this.tooltip.x = ev.layerX;
                this.tooltip.y = ev.layerY;
                this.tooltip.data = this.candidatura;
                this.tooltip.visible = true;
            },
            mouseout(ev) {              // TODO: mixin for tooltip functionality
                this.anHover = false;

                if (!this.tooltip)
                    return;
                this.tooltip.visible = false;
            },
        },
        filters: {
            formatNumber(n, d = 0) {
                return Number(n).toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
            },
        },
    };
</script>

<style lang="less" rel="stylesheet/less">
    @import (reference) 'colors';

    .an-sector {
        path {
            stroke: white;
            stroke-width: 0.5px;
            fill: gray;
        }
        &.an-hover {
            path {
                stroke-width: 1px;
            }
        }
        text {
            fill: white;
            pointer-events: none;
        }

        &.sector-sinasignar  path { fill: @sinasignar; }
        &.sector-otros       path { fill: @otros;      }
        &.sector-pp          path { fill: @pp;         }
        &.sector-psoe        path { fill: @psoe;       }
        &.sector-ciudadanos  path { fill: @ciudadanos; }
        &.sector-podemos     path { fill: @podemos;    }
        &.sector-podemos-iu  path { fill: @podemos;    }
        &.sector-iu          path { fill: @iu;         }
        &.sector-pnv         path { fill: @pnv;        }
        &.sector-upyd        path { fill: @upyd;       }
        &.sector-ciu         path { fill: @ciu;        }
        &.sector-amaiur      path { fill: @amaiur;     }
        &.sector-bildu       path { fill: @bildu;      }
        &.sector-ccanaria    path { fill: @ccanaria;   }
        &.sector-bng         path { fill: @bng;        }
        &.sector-gbai        path { fill: @gbai;       }
        &.sector-esquerra    path { fill: @esquerra;   }
        &.sector-compromis   path { fill: @compromis;  }
        &.sector-fac         path { fill: @fac;        }
    }

</style>
