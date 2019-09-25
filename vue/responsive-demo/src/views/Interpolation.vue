<template>
    <div class="interpolation-view">
        <table>
            <tr v-for="row in rows" :key="row.name">
                <td>{{row.name}}</td>
                <td>d3.interpolate(</td>
                <td><pre>{{row.v0|breakable}}</pre></td>
                <td>,</td>
                <td><pre>{{row.v1|breakable}}</pre></td>
                <td>)</td>
                <td>
                    <svg v-if="row.path" width=200 height=200 viewBox="0 0 200 200">
                        <g transform='translate(100,100)'>
                            <path :d="row.vt"/>
                        </g>
                    </svg>
                </td>
                <td><pre>{{row.vt|breakable}}</pre></td>
            </tr>
        </table>
        <input type="range" min="0" max="1" step="0.01" v-model.number="t">{{t}}
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import * as d3 from '@/d3Bundle';
    import { interpolatePath } from 'd3-interpolate-path';

    export default {
        data: () => ({
            t: 0,
        }),
        computed: {
            rows() {
                const arc = d3.arc().innerRadius(0).outerRadius(100);
                return [
                    { name: 'numbers', v0: 0, v1: 100 },
                    { name: 'colors', v0: 'red', v1: 'blue' },
                    { name: 'strings', v0: '100px and 12pt', v1: '600px and 1pt' },
                    {
                        name: 'strings (path)',
                        path: true,
                        v0: arc({ startAngle: 0, endAngle: Math.PI / 2 }),
                        v1: arc({ startAngle: Math.PI / 2, endAngle: Math.PI }),
                    },
                    {
                        name: 'strings (symbol)',
                        path: true,
                        v0: d3.symbol().type(d3.symbolCross).size(5000)(),
                        v1: d3.symbol().type(d3.symbolStar).size(5000)(),
                    },
                    {
                        name: 'strings (symbol/path)',
                        path: true,
                        interpolatePath: true,
                        v0: d3.symbol().type(d3.symbolCross).size(5000)(),
                        v1: d3.symbol().type(d3.symbolStar).size(5000)(),
                    },
                    { name: 'dates', v0: new Date(1974, 10, 11), v1: new Date() },
                    { name: 'arrays', v0: [0, 4, 7, 9], v1: [100, 200, 300, 400] },
                    { name: 'objects', v0: { x: 0, y: 0 }, v1: { x: -200, y: 300 } },
                ].map(row => ({ ...row, vt: row.interpolatePath
                        ? interpolatePath(row.v0, row.v1)(this.t)
                        : d3.interpolate(row.v0, row.v1)(this.t) }));
            },
        },
        filters: {
            breakable(s) {
                return s.replace
                    ? s.replace(/.([A-Z])/g, '\n$1')
                    : s.getTime
                        ? dayjs(s).format('YYYY-MM-DD')
                        : s;
            },
        },
    };
</script>

<style>
    .interpolation-view input {
        width: 100%;
    }

    .interpolation-view table {
        max-width: 100%;
        table-layout: fixed;
    }

    .interpolation-view table td {
        /*word-break: break-all;*/
        /*width: 200px;*/
    }
    .interpolation-view table td svg {
        border: 1px solid blue;
    }
    .interpolation-view table td path {
        stroke: black;
        fill: #ddd;
    }
</style>
