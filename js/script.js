let data, worldData;
let currentLeftMapAttr = 'protein';
let currentRightMapAttr = 'maleHeight';
let selectedCountries = [];

Promise.all([
    d3.csv("data/average_heightnutrition.csv"),
    d3.json("data/world.geojson")
]).then(function([csvData, geoData]) {
    data = csvData;
    worldData = geoData;
    
    data.forEach(d => {
        d.country = d.Country;
        d.protein = +d.Protein_Supply;
        d.maleHeight = +d.Male_Height;
        d.femaleHeight = +d.Female_Height;
        d.gdp = +d.GDP_Per_Capita;
    });
    
    data = data.filter(d => !isNaN(d.protein) && !isNaN(d.maleHeight) && d.protein > 0 && d.maleHeight > 0);
    
    createProteinHistogram(data);
    createHeightHistogram(data);
    createScatterplot(data);
    updateMaps();
    
    d3.select('#map-left-attribute').on('change', function() {
        currentLeftMapAttr = this.value;
        updateMaps();
    });
    
    d3.select('#map-right-attribute').on('change', function() {
        currentRightMapAttr = this.value;
        updateMaps();
    });
});

function updateMaps() {
    d3.select('#map-protein').selectAll('*').remove();
    d3.select('#map-height').selectAll('*').remove();
    
    createMap(data, worldData, currentLeftMapAttr, '#map-protein');
    createMap(data, worldData, currentRightMapAttr, '#map-height');
}

function getAttributeLabel(attr) {
    const labels = {
        'protein': 'Protein Supply',
        'maleHeight': 'Male Height',
        'femaleHeight': 'Female Height',
        'gdp': 'GDP per Capita'
    };
    return labels[attr];
}

function createProteinHistogram(data) {
    const margin = {top: 20, right: 20, bottom: 50, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select('#protein-histogram')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const proteinExtent = d3.extent(data, d => d.protein);
    
    const x = d3.scaleLinear()
        .domain([proteinExtent[0] - 5, proteinExtent[1] + 5])
        .range([0, width]);
    
    const histogram = d3.histogram()
        .value(d => d.protein)
        .domain(x.domain())
        .thresholds(x.ticks(15));
    
    const bins = histogram(data);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .text("Protein Supply (g/capita/day)");
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .text("Number of Countries");
    
    svg.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => {
            const barWidth = x(d.x1) - x(d.x0) - 2;
            return barWidth > 0 ? barWidth : 0;
        })
        .attr("height", d => height - y(d.length))
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .html(`<strong>Range:</strong> ${d.x0.toFixed(1)} - ${d.x1.toFixed(1)}<br><strong>Countries:</strong> ${d.length}`);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
        })
        .on("click", function(event, d) {
            if (selectedCountries.length > 0 && d.length > 0 && selectedCountries[0] === d[0].country) {
                selectedCountries = [];
            } else {
                selectedCountries = d.map(item => item.country);
            }
            updateHighlights();
        });
}

function createHeightHistogram(data) {
    const margin = {top: 20, right: 20, bottom: 50, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select('#height-histogram')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const heightExtent = d3.extent(data, d => d.maleHeight);
    
    const x = d3.scaleLinear()
        .domain([heightExtent[0] - 5, heightExtent[1] + 5])
        .range([0, width]);
    
    const histogram = d3.histogram()
        .value(d => d.maleHeight)
        .domain(x.domain())
        .thresholds(x.ticks(15));
    
    const bins = histogram(data);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .text("Male Height (cm)");
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .text("Number of Countries");
    
    svg.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => {
            const barWidth = x(d.x1) - x(d.x0) - 2;
            return barWidth > 0 ? barWidth : 0;
        })
        .attr("height", d => height - y(d.length))
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .html(`<strong>Range:</strong> ${d.x0.toFixed(1)} - ${d.x1.toFixed(1)}<br><strong>Countries:</strong> ${d.length}`);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
        })
        .on("click", function(event, d) {
            if (selectedCountries.length > 0 && d.length > 0 && selectedCountries[0] === d[0].country) {
                selectedCountries = [];
            } else {
                selectedCountries = d.map(item => item.country);
            }
            updateHighlights();
        });
}

function createScatterplot(data) {
    const margin = {top: 20, right: 20, bottom: 50, left: 70};
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.protein) - 5, d3.max(data, d => d.protein) + 5])
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.maleHeight) - 5, d3.max(data, d => d.maleHeight) + 5])
        .range([height, 0]);
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .text("Protein Supply (g/capita/day)");
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .text("Male Height (cm)");
    
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.protein))
        .attr("cy", d => y(d.maleHeight))
        .attr("r", 4)
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .html(`<strong>${d.country}</strong><br>Protein: ${d.protein.toFixed(1)} g/capita/day<br>Height: ${d.maleHeight.toFixed(1)} cm`);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
        })
        .on("click", function(event, d) {
            if (selectedCountries.length === 1 && selectedCountries[0] === d.country) {
                selectedCountries = [];
            } else {
                selectedCountries = [d.country];
            }
            updateHighlights();
        });
}

function getColorScale(attr) {
    const scales = {
        'protein': d3.interpolateBlues,
        'maleHeight': d3.interpolateGreens,
        'femaleHeight': d3.interpolatePurples,
        'gdp': d3.interpolateOranges
    };
    return scales[attr] || d3.interpolateBlues;
}

function updateHighlights() {
    const hasSelection = selectedCountries.length > 0;
    
    d3.selectAll(".bar")
        .classed("highlighted", false)
        .classed("dimmed", false);
    
    d3.selectAll(".dot")
        .classed("highlighted", d => hasSelection && selectedCountries.includes(d.country))
        .classed("dimmed", d => hasSelection && !selectedCountries.includes(d.country));
    
    d3.selectAll(".country")
        .classed("highlighted", d => hasSelection && selectedCountries.includes(d.properties.name))
        .classed("dimmed", d => hasSelection && !selectedCountries.includes(d.properties.name));
}

function createMap(data, worldData, attr, container) {
    const width = 650;
    const height = 400;
    
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);
    
    projection.fitSize([width, height], worldData);
    
    const dataMap = new Map();
    data.forEach(d => {
        dataMap.set(d.country, d[attr]);
    });
    
    const colorScale = d3.scaleSequential()
        .domain([d3.min(data, d => d[attr]), d3.max(data, d => d[attr])])
        .interpolator(getColorScale(attr));
    
    svg.selectAll("path")
        .data(worldData.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", d => {
            const value = dataMap.get(d.properties.name);
            return value ? colorScale(value) : "#ccc";
        })
        .on("mouseover", function(event, d) {
            const value = dataMap.get(d.properties.name);
            if (value) {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .html(`<strong>${d.properties.name}</strong><br>${getAttributeLabel(attr)}: ${value.toFixed(1)}`);
            }
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
        })
        .on("click", function(event, d) {
            if (selectedCountries.length === 1 && selectedCountries[0] === d.properties.name) {
                selectedCountries = [];
            } else {
                selectedCountries = [d.properties.name];
            }
            updateHighlights();
        });
}