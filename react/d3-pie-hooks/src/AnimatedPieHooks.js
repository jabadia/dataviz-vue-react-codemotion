import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

const Pie = props => {
    const ref = useRef(null);
    const cache = useRef(props.data);
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
            const duration = 2000;
            const data = createPie(props.data);
            const prevData = createPie(cache.current);
            const group = d3.select(ref.current);
            const groupWithData = group.selectAll('g.arc').data(data);

            const arcTween = (d, i) => {
                const interpolator = d3.interpolate(prevData[i] || 0, d);
                return t => createArc(interpolator(t));
            };

            // ENTER
            const groupWithEnter = groupWithData.enter()
                .append('g')
                .attr('class','arc');

            // UPDATE
            const path = groupWithEnter.append('path')
                .merge(groupWithData.select('path.arc'));

            path
                .attr('class','arc')
                .attr('fill', (d, i) => colors(i))
            .transition().duration(duration)
                .attrTween('d', arcTween)

            const text = groupWithEnter
                .append('text')
                .merge(groupWithData.select('text'));

            text
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("fill", "white")
                .style("font-size", 10)
            .transition().duration(duration)
                .attrTween("transform", (d, i) => {
                    const interpolator = d3.interpolate(prevData[i] || 0, d);
                    return t => `translate(${createArc.centroid(interpolator(t))})`
                })
                .tween('text', (d, i, nodes) => {
                    const interpolator = d3.interpolate(prevData[i], d);
                    return t => d3.select(nodes[i]).text(format(interpolator(t).value));
                });

            // EXIT
            groupWithData.exit().remove();

            cache.current = props.data;
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
