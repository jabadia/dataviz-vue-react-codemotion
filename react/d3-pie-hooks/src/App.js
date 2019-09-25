import React, { useState } from 'react';
import * as d3 from 'd3';
import PieClass from './PieClass';
import PieHooks from './PieHooks';
import PieSVG from './PieSVG';
import AnimatedPieHooks from './AnimatedPieHooks';
import AnimatedPieSVG from './AnimatedPieSVG';
import './App.css';

function App() {
    const generateData = (value, length = 7) => d3.range(length).map((item, index) => ({
        date: index,
        value: value === null || value === undefined ? Math.random() * 100 : value,
    }));

    const [data, setData] = useState(generateData());
    const changeData = () => {
        setData(generateData());
    };

    return (
        <div className="App">
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <a href="https://medium.com/stationfive/how-to-create-a-pie-chart-with-d3-js-and-react-hooks-part-1-81bcd7f39b32">
                    artículo original
                </a>
                <button onClick={changeData}>nuevos datos</button>
                <div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <h2>sin animación</h2>
                    <div>
                        <span className="label">React Class</span><br/>
                        <PieClass
                            data={data}
                            width={200}
                            height={200}
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </div>
                    <div>
                        <span className="label">Hooks</span><br/>
                        <PieHooks
                            data={data}
                            width={200}
                            height={200}
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </div>
                    <div>
                        <span className="label">SVG Elements</span><br/>
                        <PieSVG
                            data={data}
                            width={200}
                            height={200}
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </div>
                </div>
                <div>
                    <h2>con animación</h2>
                    <div>
                        <span className="label">Animated Hooks</span><br/>
                        <AnimatedPieHooks
                            data={data}
                            width={200}
                            height={200}
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </div>
                    <div>
                        <span className="label">Animated SVG Elements</span><br/>
                        <AnimatedPieSVG
                            data={data}
                            width={200}
                            height={200}
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </div>
                </div>
            </div>
            <span>{data.map(d => Math.floor(d.value * 100) / 100).join(', ')}</span>
        </div>
    );
}

export default App;
