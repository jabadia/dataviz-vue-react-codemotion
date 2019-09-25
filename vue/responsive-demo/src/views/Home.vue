<template>
    <div class="home">
        <h1>Recaudación Primer Fin de Semana</h1>
        <div style="display: flex; justify-content: start;">
            <div style="width: 40vw;">
                <div style="margin-bottom: 20px;">
                    <label>tipo de gráfico:
                        <select v-model="linear">
                        <option :value="true">por años</option>
                        <option :value="false">por meses</option>
                    </select></label>
                    <label style="margin-left: 20px;">
                        <input type="checkbox" v-model="slowMotion" />slowMotion
                    </label>
                    <label style="margin-left: 20px;">
                        <input type="checkbox" v-model="inflationAdjusted" />inflationAdjusted
                    </label>
                </div>
                <div style="margin-bottom: 20px;">
                    <label>años: <span style="width: 5em; text-align: center; display: inline-block">{{startYear}}</span> <input type="range" min='1995' max='2019' v-model.number="startYear"></label>
                    <span style="width: 5em; text-align: center; display: inline-block">{{yearSpan}}</span>
                    <input type="range" min='1' max='40' v-model.number="yearSpan">
                    <span style="width: 5em; text-align: center; display: inline-block">{{startYear + yearSpan}}</span>
                </div>
                <div style="display: flex">
                    <stacked-bar-plot v-if="linear"
                        :movies="chartMovies"
                        :all-studios="studios"
                        :all-years="allYears"
                        :colors="colors"
                        :animation-duration='slowMotion ? 2500 : 500'
                        @hover-year="onHoverYear"/>
                    <circular-bar-plot v-else
                        :movies="chartMovies"
                        :all-studios="studios"
                        :colors="colors"
                        :animation-duration='slowMotion ? 2500 : 500'
                        @hover-month="onHoverMonth"/>
                    <div>
                        <a style="cursor: pointer" @click="selectedStudios=[]">none</a> |
                        <a style="cursor: pointer" @click="selectedStudios=Array.from(studios)">all</a>
                        <label style="display: block" v-for="studio in studios" :key="studio"
                               :style="{'background-color': colors(studio)}"
                               :class="{'selected-row': selectedStudio === studio}">
                            <input type="checkbox" :value="studio" v-model="selectedStudios"> {{studio}}
                        </label>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <a href="https://www.boxofficemojo.com/alltime/weekends/">https://www.boxofficemojo.com/alltime/weekends/</a><br><br>
                </div>
                <div v-if="inflationAdjusted && false">
                    <pre>{{inflation}}</pre>
                </div>
            </div>
            <div style="margin-left: 20px; width: calc(60vw - 45px);">
                <div>
                    <label>Seleccionado: </label>
                    <span v-if="selectedMonth">Mes: {{selectedMonth|monthName}} </span>
                    <span v-if="selectedYear">Año: {{selectedYear}} </span>
                    <span v-if="selectedStudio">Estudio: {{selectedStudio}}</span>
                    <span v-if="!selectedMonth && !selectedYear">Todos los años</span>
                </div>
                <table class="box-office-results">
                    <thead>
                    <tr>
                        <th>título</th>
                        <th>estudio</th>
                        <th>estreno</th>
                        <th>recaudación<br>estreno</th>
                        <th>salas</th>
                        <th>recaudación /<br> sala</th>
                        <th>recaudación<br>total</th>
                        <th>%</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="movie in tableMovies" :key="movie.title"
                        :style="{'background-color': selectedStudio === movie.studio ? colors(movie.studio) : undefined}"
                        :class="{'selected-row': selectedStudio === movie.studio}">
                        <td>{{movie.title}}</td>
                        <td style="text-align: center;" :style="{'background-color': colors(movie.studio)}">{{movie.studio}}</td>
                        <td style="text-align: right;">{{movie.date|formatDate}}</td>
                        <td style="text-align: right;">{{movie.opening|formatMoney}}</td>
                        <td style="text-align: right;">{{movie.theaters|formatNumber}}</td>
                        <td style="text-align: right;">{{(movie.opening / movie.theaters)|formatMoney}}</td>
                        <td style="text-align: right;">{{movie.totalGross|formatMoney}}</td>
                        <td style="text-align: right;">{{movie.opening / movie.totalGross|formatPercent}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from '@/d3Bundle';
    import CircularBarPlot from '../components/CircularBarPlot';
    import StackedBarPlot from '../components/StackedBarPlot';
    import { formatDate, monthName } from '../filters/dates';
    import { formatMoney, formatNumber, formatPercent } from '../filters/numbers';

    function parseNumber(str) {
        const digitsAndDot = str.replace(/[^0-9.]/g, '');
        return parseInt(digitsAndDot, 10);
    }

    export default {
        name: 'home',
        data() {
            return {
                selectedMonth: undefined,
                selectedYear: undefined,
                selectedStudio: undefined,
                selectedStudios: [],
                linear: true,
                slowMotion: false,
                inflationAdjusted: false,
                startYear: 1995,
                yearSpan: 50,
            };
        },
        computed: {
            movies() {
                const movies = this.inflationAdjusted && this.rawMovies && this.inflation
                    ? this.rawMovies.map(movie => ({
                        ...movie,
                        opening: movie.opening * this.inflation[movie.year],
                        totalGross: movie.totalGross * this.inflation[movie.year],
                    }))
                    : this.rawMovies;
                return movies && movies.filter(movie => movie.year >= this.startYear && movie.year <= this.startYear + this.yearSpan);
            },
            chartMovies() {
                return this.movies && this.movies.filter(movie => this.selectedStudios.includes(movie.studio));
                // return this.movies && this.movies.slice(0, 50);
                // return this.movies && this.movies.filter(movie => movie.date.getFullYear() === 2018);
            },
            tableMovies() {
                const movies = this.movies || [];
                const tableMovies = this.selectedMonth !== undefined
                    ? movies.filter(movie => movie.date.getMonth() === this.selectedMonth)
                    : this.selectedYear !== undefined
                        ? movies.filter(movie => movie.date.getFullYear() === this.selectedYear)
                        : movies;

                return tableMovies
                    .filter(movie => this.selectedStudios.includes(movie.studio))
                    .slice(0, 30);
            },
            studios() {
                return this.rawMovies
                    ? Array.from(new Set(this.rawMovies.map(movie => movie.studio)))
                    : [];
            },
            allYears() {
                return this.movies
                    ? Array.from(new Set(this.movies.map(movie => movie.date.getFullYear()))).sort()
                    : [];
            },
            colors() {
                return d3.scaleOrdinal()
                    .domain(this.studios)
                    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.studios.length).reverse())
                    .unknown('#ccc');
            },
        },
        asyncComputed: {
            async rawMovies() {
                const moviesRaw = await d3.csv('/data/movies.csv', (row) => ({
                    rank: row.Rank,
                    title: row.Title,
                    studio: row.Studio,
                    opening: parseNumber(row['Opening*']),
                    percentOfTotal: parseNumber(row['% of Total']) / 100,
                    theaters: parseNumber(row.Theaters),
                    avg: parseNumber(row['Avg.']),
                    totalGross: parseNumber(row['Total Gross^']),
                    date: new Date(row['Date**']),
                    year: new Date(row['Date**']).getFullYear(),
                }));
                this.selectedStudios = Array.from(new Set(moviesRaw.map(movie => movie.studio)));
                return moviesRaw;
            },
            async inflation() {
                const inflationRates = (await d3.csv('/data/inflation.csv', (row) => ({
                    year: +row.Year,
                    inflation: +row.Ave,
                }))).reduce((obj, row) => {
                    obj[row.year] = 1 + row.inflation / 100;
                    return obj;
                }, {});
                const [min, max] = d3.extent(Object.keys(inflationRates)).map(Number);
                let accum = 1;
                for (let year = max; year >= min; year -= 1) {
                    inflationRates[year] *= accum;
                    accum = inflationRates[year];
                }
                return inflationRates;
            },
        },
        methods: {
            onHoverMonth(month, studio) {
                console.log('hover-month', month, studio);
                this.selectedMonth = month;
                this.selectedStudio = studio;
            },
            onHoverYear(year, studio) {
                console.log('hover-year', year, studio);
                this.selectedYear = year;
                this.selectedStudio = studio;
            },
        },
        components: {
            CircularBarPlot,
            StackedBarPlot,
        },
        filters: {
            formatDate,
            monthName,
            formatMoney,
            formatPercent,
            formatNumber,
        },
    };
</script>

<style>
    .selected-row {
        background: orange;
    }
    .box-office-results {
        table-layout: fixed;
        border-collapse: collapse;
    }
    .box-office-results td, .box-office-results th {
        padding: 2px 5px;
        border-right: 1px solid #ccc;
    }
    .box-office-results td {
    }
    .box-office-results th {
        text-align: left;
        text-transform: capitalize;
        border-bottom: 1px solid #ccc;
    }
</style>
