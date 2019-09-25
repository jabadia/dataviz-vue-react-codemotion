<template>
    <div class="view-box-demo" style="margin-top: 20px;">
        <table>
            <tr>
                <td>width factor:</td>
                <td><input type="range" min="0.5" max="5" step="0.1" v-model.number="widthFactor">{{widthFactor}}<br></td>
            </tr>
            <tr>
                <td>viewBox factor:</td>
                <td><input type="range" min="0.5" max="5" step="0.1" v-model.number="viewBoxFactor">{{viewBoxFactor}}</td>
            </tr>
            <tr>
                <td>both:</td>
                <td><input type="range" min="0.5" max="5" step="0.1" v-model.number="bothFactor">{{bothFactor}}</td>
            </tr>
        </table>
        <button @click="viewBoxFactor=3; widthFactor=3; bothFactor=1">reset</button>
        <div v-for="viewBox in viewBoxes"
             :key="viewBox.color"
        >
            <div :style="{color: viewBox.color}">&lt;svg width="{{viewBox.width}}" viewBox="{{viewBox.box.join(' ')}}"></div>
            <circle-with-view-box
                :style="{border: '2px solid ' + viewBox.color}"
                :view-box="viewBox"
                :view-boxes="viewBoxes"/>
        </div>
    </div>
</template>

<script>
    import CircleWithViewBox from '../components/CircleWithViewBox';

    export default {
        data: () => ({
            widthFactor: 3,
            viewBoxFactor: 3,
            bothFactor: 1,
        }),
        computed: {
            viewBoxes() {
                const d = n => Math.round(n * this.viewBoxFactor * this.bothFactor);
                return [
                    { color: 'black', box: [-100, -80, 200, 160].map(d), width: Math.floor(200 * this.widthFactor * this.bothFactor) },
                    { color: 'blue', box: [-80, -40, 100, 60].map(d), width: Math.floor(100 * this.widthFactor * this.bothFactor) },
                    { color: 'green', box: [-10, -10, 80, 45].map(d), width: Math.floor(80 * this.widthFactor * this.bothFactor) },
                    { color: 'red', box: [0, 0, 50, 50].map(d), width: Math.floor(50 * this.widthFactor * this.bothFactor) },
                ];
            },
        },
        components: {
            CircleWithViewBox,
        },
    };
</script>

<style>
    .view-box-demo > div {
        margin: 20px 0px;
    }
    .view-box-demo input {
        width: 300px;
    }
    .view-box-demo svg {
        /*width: 1000px;*/
        background: #eee;
    }
</style>
