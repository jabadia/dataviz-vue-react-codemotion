<template>
    <div class="pacman-view">
        <div class="pacman-container">
            <svg viewBox="0 0 600 600" class="pacman-chart">
                <g :transform="`translate(${radius},${radius})`">
                    <circle v-show="animationId" class="pacman-dot" :cx="cx" cy="0" r="50"/>
                    <path class="pacman-sector" :d="path"/>
                </g>
            </svg>
            <div class="pacman-controls">
                <div class="legend" :style="{opacity: isPacman ? 1 : 0}">
                    <h1>¿Cuándo maduraré?</h1>
                    <ul>
                        <li :style="{opacity: isPacman ? 1 : 0}"><div class="legend-swatch" style="background: black;"/>Nunca</li>
                        <li :style="{opacity: isPacman ? 1 : 0}"><div class="legend-swatch" style="background: yellow;"/>Nunca, en amarillo para pintar un PACMAN</li>
                    </ul>
                </div>
                <div class="controls">
                    <div>{{angle1}}</div>
                    <input type="range" min="-360" max="360" step="10" v-model.number="angle1">
                    <div>{{angle2}}</div>
                    <input type="range" min="-360" max="360" step="10" v-model.number="angle2">
<!--                    <button @click="angle1 = 60; angle2 = -240">sct</button>-->
                    <button @click="reset">reset</button>
                    <button :disabled="!isPacman || animationId" @click="startAnimation">go</button>
                    <button :disabled="!animationId" @click="stopAnimation">stop</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from '@/d3Bundle';

    const toRad = (deg) => deg * Math.PI / 180.0;

    export default {
        data: () => ({
            angle1: -10,  // 60
            angle2: 10,  // -240
            radius: 300,
            cx: 50,
            isPacman: false,
            animationId: undefined,
        }),
        computed: {
            path() {
                return d3.arc()
                    .endAngle(toRad(this.angle2))
                    .startAngle(toRad(this.angle1))
                    .innerRadius(0)
                    .outerRadius(300)();
            },
        },
        watch: {
            path() {
                if (this.angle1 === 60 && this.angle2 === -240) {
                    setTimeout(() => {
                        this.isPacman = true;
                    }, 1000);
                }
            },
        },
        methods: {
            reset() {
                this.angle1 = -10;
                this.angle2 = 10;
                this.isPacman = false;
            },
            startAnimation() {
                this.stopAnimation();
                this.animationId = requestAnimationFrame(this.updateAngles);
            },
            stopAnimation() {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = undefined;
                }
                this.angle1 = 60;
                this.angle2 = -240;
            },
            updateAngles(t) {
                const pacmanSpeed = 0.01;
                const dotSpeed = 0.5;
                const delta = Math.sin(t * pacmanSpeed);
                this.angle1 = Math.floor(60 + 30 * delta);
                this.angle2 = Math.floor(-240 - 30 * delta);
                const distance = this.radius * 1.5;
                this.cx = (distance / 1.5 * 1.2) + (-t * dotSpeed) % distance;
                this.animationId = requestAnimationFrame(this.updateAngles);
            },
        },
    };
</script>

<style>
    .pacman-view {
        background: black;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        font-family: Helvetica, sans-serif;
        color: white;
    }
    .pacman-container {
        display: flex;
        align-items: stretch;
        height: 100%;
    }
    .pacman-chart {
        margin: 50px;
        width: 70%;
    }
    .pacman-sector {
        fill: yellow;
        stroke: none;
    }
    .pacman-dot {
        fill: orange;
        stroke: none;
    }
    .pacman-controls {
        width: 30%;
        padding-right: 20px;
        padding-top: 20%;
    }
    .legend {
        transition: opacity 1s;
    }
    .legend h1 {
        font-size: 2.5rem;
    }
    .legend ul {
        list-style: none;
        padding: 0;
    }
    .legend li {
        margin: 10px;
        font-size: 1.5rem;
        transition: opacity 1s;
    }
    .legend li:nth-child(1) {
        transition-delay: 1.5s;
    }
    .legend li:nth-child(2) {
        transition-delay: 3s;
    }
    .legend-swatch {
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid white;
        vertical-align: middle;
        margin-right: 10px;
    }
    .pacman-controls .controls {
        margin-top: 48px;
    }
    .pacman-controls input {
        width: 100%;
    }
    button {
        transition: opacity 0.5s;
        margin-top: 24px;
        font-size: 1rem;
    }
    button:disabled {
        opacity: 0.1;
    }
</style>
