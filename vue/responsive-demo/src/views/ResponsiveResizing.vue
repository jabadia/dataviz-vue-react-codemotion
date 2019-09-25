<template>
    <div style="xdisplay: flex;">
        <svg-with-circle class="d1"></svg-with-circle>
        <svg-with-circle class="d2"></svg-with-circle>
        <svg-with-circle class="d3"></svg-with-circle>
    </div>
</template>

<script>
    import SvgWithCircle from '../components/SvgWithCircle';
    export default {
        components: {
            SvgWithCircle,
        },
    };
</script>

<style>
    .d1 {
        width: 100%;
        min-width: 300px;
        background: #aaa;
    }
    .d1 circle {
        fill: #16a085;
    }
    .d2 {
        width: 100%;
        min-width: 300px;
        background: #ccc;
    }
    .d2 circle {
        fill: coral;
    }
    .d3 {
        width: 100%;
        min-width: 300px;
        background: #bbb;
    }
    .d3 circle {
        fill: goldenrod;
    }
</style>
