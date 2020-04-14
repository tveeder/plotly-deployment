function buildMetadata(sample) {

    var metadataRoute = `/metadata/${sample}`;
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata



    d3.json(metadataRoute).then(function(sample) {
        var selectSampleData = d3.select("#sample-metadata");
        selectSampleData.html("");
        console.log("Testing");
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        // Iterate through each key and value


        Object.entries(sample).forEach(function([key, value]) {
            selectSampleData.append("p").text(`${key}:${value}`)
        });
    });
}

// code for bonus portion follows
// function callBuildGauge() {   
//   buildGauge("one");
// };


function buildGauge(sample) {
    var freqRoute = `/metadata/${sample}`;
    d3.json(freqRoute).then(data => {
        // Enter a max frequency for scrubbings
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
                name: 'Frequency of Scrubs per Wk.',
                text: level,
                hoverinfo: 'text+name'
            },
            {
                // Divide one half of the pie chart into nine separate pieces...
                values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
                rotation: 90,
                // This doesn't make much sense to have duplication of values at each tier...however, this is what the image asked for.
                // If there were fractional WFREQs, it may make more sense.  
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: ['#84B589', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                        '#F4F1E4', '#F8F3EC', 'rgba(255, 255, 255, 0)',
                    ]
                },
                hoverinfo: 'label',
                labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3',
                    '1-2', '0-1', ''
                ],
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
            title: '<b>Frequencies of Belly Button Scrubbings per Week<b>',
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

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var plotDataRoute = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(plotDataRoute).then(data => {
            var bubbleTrace = {
                x: data.otu_ids,
                y: data.sample_values,
                text: data.otu_labels,
                mode: `markers`,
                marker: {
                    size: data.sample_values,
                    color: data.otu_ids

                },
                showlegend: false
            };
            var data = [bubbleTrace]
            var layout = {
                title: "Belly Button Bacteria Data Analysis",
                xaxis: {
                    title: "OTU IDs"
                }
            };
            Plotly.plot("bubble", data, layout);
        })
        // Pie Chart code
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
    d3.json(plotDataRoute).then(data => {
        var pieTrace = [{
            values: data.sample_values.slice(0, 10),
            labels: data.otu_ids.slice(0, 10),
            hovertext: data.otu_labels.slice(0, 10),
            type: "pie"
        }];
        var layout = {
            title: "Top 10 Sample Values"
        };
        Plotly.plot("pie", pieTrace, layout)
    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
        buildGauge(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGauge(newSample);
};

// Initialize the dashboard
init();