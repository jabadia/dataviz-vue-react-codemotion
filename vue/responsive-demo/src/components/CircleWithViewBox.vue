<template>
    <svg class="circle-with-view-box" :width="viewBox.width" :viewBox="viewBox.box.join(' ')">
        <g>
            <circle cx=0 cy=0 r=50></circle>
            <g ref="axisX"></g>
            <g ref="axisY"></g>
            <g v-for="vb in otherViewBoxes"
               :key="vb.color"
            >
                <rect
                    :x="vb.box[0]"
                    :y="vb.box[1]"
                    :width="vb.box[2]"
                    :height="vb.box[3]"
                    :stroke="vb.color"
                />
                <text
                    :x="vb.box[0]"
                    :y="vb.box[1] + vb.box[3]"
                    dy="1em"
                    :fill="vb.color">viewBox="{{vb.box.join(' ')}}"</text>
            </g>
        </g>
    </svg>
</template>

<script>
    import * as d3 from '@/d3Bundle';

    export default {
        props: {
            viewBox: Object,
            viewBoxes: Array,
        },
        data() {
            return {};
        },
        computed: {
            otherViewBoxes() {
                return this.viewBoxes.filter(vb => vb !== this.viewBox);
            },
        },
        watch: {
            viewBox() {
                this.renderChart();
            },
        },
        methods: {
            renderChart() {
                const minX = d3.min(this.viewBoxes, viewBox => viewBox.box[0]);
                const maxX = d3.max(this.viewBoxes, viewBox => viewBox.box[0] + viewBox.box[2]);
                const xScale = d3.scaleLinear().domain([minX, maxX]).range([minX, maxX]);
                d3.select(this.$refs.axisX).call(d3.axisBottom(xScale));

                const minY = d3.min(this.viewBoxes, viewBox => viewBox.box[1]);
                const maxY = d3.max(this.viewBoxes, viewBox => viewBox.box[1] + viewBox.box[3]);
                const yScale = d3.scaleLinear().domain([minY, maxY]).range([minY, maxY]);
                d3.select(this.$refs.axisY).call(d3.axisLeft(yScale));
            },
        },
        mounted() {
            this.renderChart();
        },
    };
</script>

<style>
    .circle-with-view-box {
        font-family: Helvetica;
        font-size: 12px;
    }
    .circle-with-view-box rect {
        stroke-width: 2px;
        fill: none;
        shape-rendering: crispEdges;
    }
    .circle-with-view-box circle {
        fill: yellow;
        stroke: black;
        stroke-width: 1px;
    }
</style>
