'use strict';

// Code for fetching information to homepage
const url = 'http://localhost:3000'; // change url when uploading to server

const printGraph = (measurements) => {


    am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chartdiv");


        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);


        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true
        }));


        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.1,
            baseInterval: {
                timeUnit: "day",
                count: 1
            },
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            title: "Readiness",
            renderer: am5xy.AxisRendererY.new(root, {})
        }));


        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Readiness",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));


        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal",
            height: 10
        }));


        // Set data readiness measurements
        /* var data = generateDatas(15);
        console.log(data); */
        console.log(measurements);
        let data = [];
        measurements.forEach(element => {
            if (element.result.readiness) {
                const timestamp = Date.parse(element.create_timestamp);
                data.push({ date: timestamp, value: Math.round(element.result.readiness) });
            }
        });
        series.data.setAll(data);


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

    }); // end am5.ready()
}


// Hrv measurement
// select existing html elements
const ul1 = document.getElementById('checkHrv');

// This function prints measurement information from json file.
const printKubios = (measurements) => {

    //console.log(measurements);
    if (measurements.length > 0) {
        const i = measurements.length - 1;
        const html = `<h2>HRV-data</h2>
                <p style="text-align: center; margin-top: 2rem; ">
                Readiness: ${Math.round((measurements[i].result.readiness) * 100) / 100}<br>
                Mean_hr_bpm: ${Math.round((measurements[i].result.mean_hr_bpm) * 100) / 100}<br>
                PNS-index: ${Math.round((measurements[i].result.pns_index) * 100) / 100}<br>
        RMSSD(ms): ${Math.round((measurements[i].result.rmssd_ms) * 100) / 100}<br>
                Stress_index: ${Math.round((measurements[i].result.stress_index) * 100) / 100}</p>`;
        ul1.innerHTML = html;
    }
}

// Ajax call for fetching Hrv measurement information
const getKubios = async () => {
    try {
        const response = await fetch(url + '/kubios');
        const measurements = await response.json();
        printKubios(measurements);
        printGraph(measurements);
    } catch (e) {
        console.log(e.message);
    }
};
getKubios();