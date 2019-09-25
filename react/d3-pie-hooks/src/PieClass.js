import React, { createRef, Component } from 'react';
import * as d3 from 'd3';

class PieClass extends Component {
    constructor(props) {
        super(props);
        this.ref = createRef();
        this.createPie = d3.pie()
            .value(d => d.value)
            .sort(null);
        this.createArc = d3.arc()
            .innerRadius(props.innerRadius)
            .outerRadius(props.outerRadius);
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.format = d3.format('.2f');
    }

    componentDidMount() {
        this.initChart(this.ref.current, this.props);
        this.renderChart(this.ref.current, this.props);
    }

    componentWillUpdate(nextProps) {
        this.renderChart(this.ref.current, nextProps);
    }

    initChart(svgRef, props) {
        const svg = d3.select(svgRef);
        const { width, height, outerRadius } = props;

        svg
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height);

        svg.append('g')
            .attr('transform', `translate(${outerRadius},${outerRadius})`);
    }

    renderChart(svgRef, props) {
        const svg = d3.select(svgRef);
        const data = this.createPie(props.data);

        const group = svg.select('g').selectAll('g.arc').data(data);

        // ENTER
        const groupWithEnter = group.enter().append('g')
            .attr('class', 'arc');

        groupWithEnter.append('path')
            .attr('class', 'arc')
            .attr('d', this.createArc)
            .attr('fill', (d, i) => this.colors(d.index));

        groupWithEnter.append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('transform', d => `translate(${this.createArc.centroid(d)})`)
            .style('fill', 'white')
            .style('font-size', 10)
            .text(d => this.format(d.value));

        // UPDATE
        const pathUpdate = group.merge(groupWithEnter).select('path');
        pathUpdate
            .attr('class','arc')
            .attr('d', this.createArc)
            .attr('fill', (d,i) => this.colors(i));

        const textUpdate = group.merge(groupWithEnter).select('text');
        textUpdate
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('transform', d => `translate(${this.createArc.centroid(d)})`)
            .text(d => this.format(d.value));

        // EXIT
        group.exit().remove();
    }

    render() {
        return <svg ref={this.ref}/>;
    }
}

export default PieClass;
