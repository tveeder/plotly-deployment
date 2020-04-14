function buildGauge(sample) {
    var freqRoute = `/metadata/${sample}`;
    d3.json(freqRoute).then(data => {
        // Enter a max wash frequency
        var level = data.WFREQ
            // Trig to calculate meter point
        var degrees = 9 - level,
            radius = 0.5;
        var radians = degrees * Math.PI / 9;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        // Create the Path
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd)
            // Create Trace
        var gaugeData = [{
                type: 'scatter',
                x: [0],
                y: [0],
                marker: {
                    size: 28,
                    color: '850000'
                },
                showlegend: true,
                name: 'Frequency of Washes per Wk.',
                text: level,
                hoverinfo: 'text+name'
            },
            {
                values: [50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50],
                rotation: 90,
                text: ['8-9', '7-8', '5-6', '3-4', '1-2', '0'],
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                        'rgba(255, 255, 255, 0)'
                    ]
                },
                hoverinfo: 'label',
                hole: 0.5,
                type: 'pie',
                showlegend: false
            }
        ];
        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            title: '<b>Gauge</b> <br> Frequencies of Belly Button Washes / Wk.',
            height: 700,
            width: 700,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        };
        Plotly.newPlot("gauge", gaugeData, layout);
    });
}