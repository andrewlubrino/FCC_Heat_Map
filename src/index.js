import "./styles.css";
import * as d3 from "d3";

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((resp) => resp.json())
  .then((data) => {
    var tempColors = [12.8, 11.7, 10.6, 9.5, 8.3, 7.2, 6.1, 5.0, 3.9, 2.8];
    var legendColors = [12.8, 11.7, 10.6, 9.5, 8.3, 7.2, 6.1, 5.0, 3.9];
    var colorArray = [
      "#ff0000",
      "#dc143c",
      "#fa8072",
      "#ffd8b1 ",
      "#ffe5b4",
      "#B2DFEE",
      "#9AC0CD",
      "#39B7CD",
      "#236B8E"
    ];

    var monthCodes = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var margins = {
      top: 100,
      left: 100,
      bottom: 100,
      right: 100
    };

    var dataArray = data.monthlyVariance.map((elem) => {
      elem.temperature = elem.variance + data.baseTemperature;
      return elem;
    });

    var yearData = dataArray.map((elem) => elem.year);

    var height = 600;
    var width = 1300;

    var barHeight = (height - (margins.top + margins.bottom)) / 12;
    var barWidth =
      (width - (margins.left + margins.right)) /
      Math.ceil(dataArray.length / 12);

    var xScale = d3
      .scaleLinear()
      .domain(d3.extent(yearData))
      .range([margins.left, width - margins.right]);

    var legendScale = d3
      .scaleLinear()
      .domain(d3.extent(tempColors))
      .range([margins.left + 300, margins.left]);

    var legendWidth = 300 / 9;

    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickFormat(d3.format(""))
      .ticks(26)
      .tickSizeOuter(0);

    var legendAxis = d3
      .axisBottom()
      .scale(legendScale)
      .ticks(10)
      .tickValues(tempColors)
      .tickFormat((d) => {
        return d.toFixed(1);
      });

    var yScale = d3
      .scaleLinear()
      .domain([12, 1])
      .range([
        height - margins.bottom - barHeight / 2,
        margins.top + barHeight / 2
      ]);

    var yScaleBlank = d3
      .scaleLinear()
      .domain([1, 12])
      .range([height - margins.bottom, margins.top]);

    var yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat((d) => {
        return monthCodes[d - 1];
      });

    var yAxisBlank = d3
      .axisLeft()
      .scale(yScaleBlank)
      .tickSize(0)
      .tickValues([]);

    var tooltip = d3
      .select("body")
      .append("div")
      .style("opacity", 0)
      .style("background-color", "#000")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("height", "50px")
      .style("width", "130px")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("justify-content", "space-around")
      .style("text-align", "center");

    var svg = d3
      .select("body")
      .attr("height", "100vh")
      .attr("width", "75vw")
      .attr("class", "body-class")
      .style("display", "flex")
      .style("flex-direction", "row")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("height", "100vh")
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .style("background-color", "white");

    svg
      .selectAll("rect")
      .data(legendColors)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return i * legendWidth + margins.left;
      })
      .attr("y", height - 64)
      .attr("height", legendWidth)
      .attr("width", legendWidth)
      .style("fill", (d) => {
        var counter;
        for (counter = 0; counter < tempColors.length; ++counter) {
          if (d > tempColors[counter]) {
            break;
          }
        }
        return colorArray[counter];
      });

    svg
      .selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("height", barHeight)
      .attr("width", barWidth)
      .attr("class", "hover-class")
      .attr("x", (d) => {
        return (d.year - yearData[0]) * barWidth + margins.left;
      })
      .attr("y", (d) => {
        return (d.month - 1) * barHeight + margins.top;
      })
      .style("fill", (d) => {
        var counter;
        for (counter = 0; counter < tempColors.length; ++counter) {
          if (d.temperature > tempColors[counter]) {
            break;
          }
        }
        return colorArray[counter];
      })
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 0.8)
          .style("position", "absolute")
          .style("left", d3.pointer(event)[0] + 230 + "px")
          .style("top", d3.pointer(event)[1] + margins.bottom + 30 + "px")
          .html(
            d.year +
              " - " +
              monthCodes[d.month - 1] +
              "<br>" +
              d.temperature.toFixed(1) +
              "&deg;C <br>"
          );
      })
      .on("mouseleave", function (d) {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", "translate(0, " + (height - margins.bottom) + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", "translate(" + margins.left + " ,0)")
      .call(yAxis);

    svg
      .append("g")
      .attr("transform", "translate(0, " + (height - 30) + ")")
      .call(legendAxis);

    svg
      .append("g")
      .attr("transform", "translate(" + margins.left + " ,0)")
      .call(yAxisBlank);

    svg
      .append("text")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .attr("x", width / 2)
      .attr("y", 0 + 40)
      .attr("text-anchor", "middle")
      .text("Monthly Global Land-Surface Temperature");

    svg
      .append("text")
      .style("font-size", "18px")
      .attr("x", width / 2)
      .attr("y", 0 + 70)
      .attr("text-anchor", "middle")
      .text("1753 - 2015: base temperature 8.66℃");
  });
