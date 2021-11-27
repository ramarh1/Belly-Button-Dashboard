function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sample_arr = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filtered_samples = sample_arr.filter(sample_1 => sample_1.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result_1 = filtered_samples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result_1.otu_ids;
    var labels = result_1.otu_labels.slice(0,10).reverse();
    var sample_values = result_1.sample_values.slice(0,10).reverse();

    var bubbleLabels = result_1.otu_labels;
    var bubbleValues = result_1.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = ids.map(a => "OTU " + a).slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
        x: sample_values,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h"

    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


     // 1. Create the trace for the bubble chart.
     var bubbleData = [{
          
        x: ids,
        y: bubbleValues,
        text: bubbleLabels,
        mode: "markers",
        marker: {
            size: bubbleValues,
            color: bubbleValues,
            colorscale: "Portland"

        }


     }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        automargin: true,
        hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    var metadata = data.metadata;
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeArr = metadata.filter(metaObject => metaObject.id == sample);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var gauge_sample = gaugeArr[0];

    


    // 3. Create a variable that holds the washing frequency.
   var washfreq = gauge_sample.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
        value: washfreq,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        gauge: {
            axis: {range: [null,10], dtick:"2"},
            bar: {color: "black"},
            steps:[
                {range: [0,2], color: "red"},
                {range: [2,4], color: "orange"},
                {range: [4,6], color: "yellow"},
                {range: [6,8], color: "lightgreen"},
                {range: [8,10], color: "green"}

            ],
            dtick: 2
    
    
    }
     
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);    
  });
}

