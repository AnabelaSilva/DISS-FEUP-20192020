
window.onload = function () {
    // let  color = ["red", "orange", "yellow", "green", "blue", "purple", "grey"];
    // let colorIndex = 0;
    // let datasets = [];
    // labels = [];
    // results.forEach(element => {
    //     let set = datasets.find(el => { return el.label == element.name; });
    //     let label = labels.find(el => { return el == element.WeekNumber; });
    //     if (label == null) {
    //         label = element.WeekNumber;
    //         labels.push(label);
    //     }
    //     if (set == null) {
    //         set = { label: element.name, data: [], fill: false, borderColor: color[colorIndex++] };
    //         datasets.push(set);
    //     }
    //     set.data[element.WeekNumber] = element.Visitors;
    // });
    // var ctx = document.getElementById('myChart').getContext('2d');
    // var mixedChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         datasets: datasets,
    //         labels: labels
    //     },
    //     options: {
    //         responsive: true,
    //         hoverMode: 'index',
    //         fill: false,
    //         title: {
    //             display: true,
    //             text: 'Activity by course'
    //         }
    //     }
    // });


    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Simple Line Chart"
        },
        axisY:{
            includeZero: false
        },
        data: [{        
            type: "line",
              indexLabelFontSize: 16,
            dataPoints: [
                { y: 450 },
                { y: 414},
                { y: 520, indexLabel: "\u2191 highest",markerColor: "red", markerType: "triangle" },
                { y: 460 },
                { y: 450 },
                { y: 500 },
                { y: 480 },
                { y: 480 },
                { y: 410 , indexLabel: "\u2193 lowest",markerColor: "DarkSlateGrey", markerType: "cross" },
                { y: 500 },
                { y: 480 },
                { y: 510 }
            ]
        }]
    });
    chart.render();
    
    }
}