let data, worldData;
let currentXAttr = 'protein';
let currentYAttr = 'maleHeight';

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
    
    updateVisualizations();
    
    d3.select('#x-attribute').on('change', function() {
        currentXAttr = this.value;
        updateVisualizations();
    });
    
    d3.select('#y-attribute').on('change', function() {
        currentYAttr = this.value;
        updateVisualizations();
    });
});

function updateVisualizations() {
    d3.select('#protein-histogram').selectAll('*').remove();
    d3.select('#height-histogram').selectAll('*').remove();
    d3.select('#scatterplot').selectAll('*').remove();
    d3.select('#map-protein').selectAll('*').remove();
    d3.select('#map-height').selectAll('*').remove();
    
    const rows = document.querySelectorAll('.row');
    rows[0].querySelector('section:nth-child(1) h2').textContent = getAttributeTitle(currentXAttr) + ' Distribution';
    rows[0].querySelector('section:nth-child(2) h2').textContent = getAttributeTitle(currentYAttr) + ' Distribution';
    document.querySelector('.full-width h2').textContent = `Correlation: ${getAttributeTitle(currentXAttr)} vs ${getAttributeTitle(currentYAttr)}`;
    rows[1].querySelector('section:nth-child(1) h2').textContent = getAttributeTitle(currentXAttr) + ' by Country';
    rows[1].querySelector('section:nth-child(2) h2').textContent = getAttributeTitle(currentYAttr) + ' by Country';
    
    createHistogram(data, currentXAttr, '#protein-histogram');
    createHistogram(data, currentYAttr, '#height-histogram');
    createScatterplot(data, currentXAttr, currentYAttr);
    createMap(data, worldData, currentXAttr, '#map-protein');
    createMap(data, worldData, currentYAttr, '#map-height');
}

function getAttributeLabel(attr) {
    const labels = {
        'protein': 'Protein Supply (g/capita/day)',
        'maleHeight': 'Male Height (cm)',
        'femaleHeight': 'Female Height (cm)',
        'gdp': 'GDP per Capita (USD)'
    };
    return labels[attr];
}

function getAttributeTitle(attr) {
    const titles = {
        'protein': 'Protein Supply',
        'maleHeight': 'Male Height',
        'femaleHeight': 'Female Height',
        'gdp': 'GDP per Capita'
    };
    return titles[attr];
}

function createHistogram(data, attr, container) {
    const margin = {top: 20, right: 20, bottom: 50, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const attrExtent = d3.extent(data, d => d[attr]);
    
    const x = d3.scaleLinear()
        .domain([attrExtent[0] - 5, attrExtent[1] + 5])
        .range([0, width]);
    
    const histogram = d3.histogram()
        .value(d => d[attr])
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
        .text(getAttributeLabel(attr));
    
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
        .attr("height", d => height - y(d.length));
}

function createScatterplot(data, xAttr, yAttr) {
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
        .domain([d3.min(data, d => d[xAttr]) - 5, d3.max(data, d => d[xAttr]) + 5])
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d[yAttr]) - 5, d3.max(data, d => d[yAttr]) + 5])
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
        .text(getAttributeLabel(xAttr));
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .text(getAttributeLabel(yAttr));
    
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d[xAttr]))
        .attr("cy", d => y(d[yAttr]))
        .attr("r", 4);
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
        });
}