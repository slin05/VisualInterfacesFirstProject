let data;

d3.csv("data/average_heightnutrition.csv").then(function(_data) {
    data = _data;
    
    data.forEach(d => {
        d.country = d.Country;
        d.protein = +d.Protein_Supply;
        d.maleHeight = +d.Male_Height;
        d.femaleHeight = +d.Female_Height;
    });
    
    data = data.filter(d => !isNaN(d.protein) && !isNaN(d.maleHeight) && d.protein > 0 && d.maleHeight > 0);
    
    createProteinHistogram(data);
});

function createProteinHistogram(data) {
    const margin = {top: 20, right: 30, bottom: 60, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select("#protein-histogram")
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
        .attr("height", d => height - y(d.length));
}