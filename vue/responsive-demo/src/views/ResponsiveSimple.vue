<template>
    <div>
        <svg-with-circle class="c1"></svg-with-circle>
        <svg-with-circle class="c2"></svg-with-circle>
        <svg-with-circle class="c3"></svg-with-circle>
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
    .c1 {
        width: 150px;
        height: 150px;
        background: #aaa;
    }
    .c1 circle {
        fill: #16a085;
    }
    .c2 {
        width: 400px;
        height: 400px;
        background: #ccc;
    }
    .c2 circle {
        fill: coral;
    }
    .c3 {
        width: 500px;
        height: 500px;
        background: #bbb;
    }
    .c3 circle {
        fill: goldenrod;
    }
</style>
