<template>
    <div class="an-chart-wrapper">
        <svg class="an-hemiciclo-chart" :width="width" :height="height" :viewBox="[0,0,width,height].join(' ')">
            <g v-if="sectors" class="an-pie" :transform="`translate(${width/2}, ${height})`">
                <animated-sector
                    v-for="sector in sectors"
                    :sector="sector"
                    :tooltip="tooltip"
                    :key="sector.data.sCandidaturaUnificada"
                    :duration="duration"/>
            </g>
        </svg>
        <div
            class="an-tooltip"
            :class="{'an-tooltip--visible': tooltip.visible}"
            :style="tooltipPos">
            <div v-if="tooltip.data">
                <span :class="`fg-${tooltip.data.sCandidaturaUnificada}`">{{tooltip.data.sCandidatura}}</span>:
                {{tooltip.data.iEscanos}}
            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import AnimatedSector from './AnimatedSector';

    export default {
        name: 'hemiciclo-chart',
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
                tooltip: {
                    x: 0,
                    y: 0,
                    text: '',
                    visible: false,
                    offset: {
                        x: 10,
                        y: 0,
                    },
                },
            };
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
            tooltipPos() {
                return {
                    left: this.tooltip.offset.x + this.tooltip.x + 'px',
                    top: this.tooltip.offset.y + this.tooltip.y + 'px',
                };
            },
        },
        components: {
            AnimatedSector,
        },
    };
</script>

<style lang="less">
    @import (reference) 'colors';

    .an-chart-wrapper {
        position: relative;

        .an-hemiciclo-chart {
            display: block;
        }
        .an-tooltip {
            position: absolute;
            padding: 5px;
            background: white;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;

            &--visible {
                opacity: 0.8;
            }
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
