import React, { useEffect, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import * as d3 from 'd3';

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format('.2f');
const animationDuration = 2000;
const animationConfig = {
    to: async (next, cancel) => {
        await next({ t: 1 });
    },
    from: { t: 0 },
    config: { duration: animationDuration },
    reset: true,
};

const Arc = ({ index, from, to, createArc, colors, format, animatedProps }) => {
    const interpolator = d3.interpolate(from, to);

    return (
        <g key={index} className="arc">
            <animated.path
                className="arc"
                d={animatedProps.t.interpolate(t => createArc(interpolator(t)))}
                fill={colors(index)}
            />
            <animated.text
                transform={animatedProps.t.interpolate(
                    t => `translate(${createArc.centroid(interpolator(t))})`,
                )}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="10"
            >
                {animatedProps.t.interpolate(t => format(interpolator(t).value))}
            </animated.text>
        </g>
    );
};

const Pie = props => {
    const cache = useRef([]);
    const createPie = d3
        .pie()
        .value(d => d.value)
        .sort(null);
    const createArc = d3
        .arc()
        .innerRadius(props.innerRadius)
        .outerRadius(props.outerRadius);
    const data = createPie(props.data);
    const previousData = createPie(cache.current);

    const [animatedProps, setAnimatedProps] = useSpring(() => animationConfig);
    setAnimatedProps(animationConfig);

    useEffect(() => {
        cache.current = props.data;
    });

    return (
        <svg width={props.width} height={props.height}>
            <g transform={`translate(${props.outerRadius} ${props.outerRadius})`}>
                {data.map((d, i) => (
                    <Arc
                        key={i}
                        index={i}
                        from={previousData[i]}
                        to={d}
                        createArc={createArc}
                        colors={colors}
                        format={format}
                        animatedProps={animatedProps}
                    />
                ))}
            </g>
        </svg>
    );
};

export default Pie;
