<template>
    <div class="an-results-table">
        <table v-if="candidaturas">
            <tr>
                <th>Partido</th>
                <th>Escaños</th>
                <th>Votos</th>
            </tr>
            <tr v-for="(candidatura,i) in candidaturasWithEscanos"
                :class="{'an-odd-row': i % 2}"
                :key="i"> <!-- candidatura.sCandidaturaUnificada -->
                <td class="an-candidatura">{{candidatura.sCandidatura}}</td>
                <td class="an-escanos">{{candidatura.iEscanos}}</td>
                <td class="an-votos">{{candidatura.iVotos|formatNumber}}</td>
            </tr>
        </table>
        <div v-else>
            cargando...
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            candidaturas: Array,
        },
        computed: {
            candidaturasWithEscanos() {
                return this.candidaturas && this.candidaturas.filter(c => c.iEscanos !== 0);
            },
        },
        filters: {
            formatNumber(n) {
                return Number(n).toLocaleString();
            },
        },
    };
</script>

<style lang="less" rel="stylesheet/less">
    .an-results-table {
        width: 100%;
        margin: 0 10px;

        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
        }

        td {
            padding: 1px 5px;
        }

        .an-odd-row {
            background: #e7e7e7;
        }
        .an-escanos {
            text-align: right;
        }
        .an-votos {
            text-align: right;
        }
    }
</style>
