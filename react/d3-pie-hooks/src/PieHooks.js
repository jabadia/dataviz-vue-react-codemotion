import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

const Pie = props => {
    const ref = useRef(null);
    const createPie = d3.pie()
        .value(d => d.value)
        .sort(null);
    const createArc = d3.arc()
        .innerRadius(props.innerRadius)
        .outerRadius(props.outerRadius);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const format = d3.format('.2f');

    useEffect(
        () => {
            const data = createPie(props.data);
            const group = d3.select(ref.current);
            const groupWithData = group.selectAll('g.arc').data(data);

            // ENTER
            const groupWithEnter = groupWithData.enter()
                .append('g')
                .attr('class','arc');

            // UPDATE
            const path = groupWithEnter.append('path')
                .merge(groupWithData.select('path.arc'));

            path
                .attr('class','arc')
                .attr('d', createArc)
                .attr('fill',(d,i) => colors(i));

            const text = groupWithEnter
                .append('text')
                .merge(groupWithData.select('text'));

            text
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("transform", d => `translate(${createArc.centroid(d)})`)
                .style("fill", "white")
                .style("font-size", 10)
                .text(d => format(d.value));

            // EXIT
            groupWithData.exit().remove();
        },
        [
            props.data,  // only dependency that changes
            colors, createArc, createPie, format
        ],
    );

    return (
        <svg width={props.width} height={props.height}>
            <g ref={ref}
               transform={`translate(${props.outerRadius} ${props.outerRadius})`} />
        </svg>
    );
};

export default Pie;
