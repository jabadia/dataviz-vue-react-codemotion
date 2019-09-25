<template>
    <div>
        <div class="palette__variation" v-for="(variation, index) in variations" :key="index">
            <div class="palette__color" v-for="color in variation" :style="{backgroundColor: color}" :key="color.hex()">
                {{color.hex()}}
            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from '@/d3Bundle';

    export default {
        data() {
            return {
                baseColors: ['#f6d146', '#3a76c7', '#023e9e', '#b87928', '#052b55'],
                // baseColors: ['#bde1df', '#acce18', '#64982f', '#53975d', '#009eb7'],
            };
        },
        computed: {
            variations() {
                const stepCount = 3;
                const maxK = 1.5;
                return [
                    ...d3.range(stepCount, 0, -1).map(
                        step => this.baseColors.map(color => d3.color(color).brighter(step / stepCount * maxK)),
                    ),
                    ...d3.range(0, stepCount + 1).map(
                        step => this.baseColors.map(color => d3.color(color).darker(step / stepCount * maxK)),
                    ),
                ];
            },
        },
    };
</script>

<style>
    .palette__variation {
        display: flex;
    }

    .palette__color {
        height: 100px;
        width: 100px;
        flex-grow: 1;
        color: white;
        font-family: sans-serif;
    }
</style>
