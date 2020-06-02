
window.onload = function () {
    let  color = ["red", "orange", "yellow", "green", "blue", "purple", "grey"];
    let colorIndex = 0;
    let datasets = [];
    labels = [];
    results.forEach(element => {
        let set = datasets.find(el => { return el.label == element.name; });
        let label = labels.find(el => { return el == element.WeekNumber; });
        if (label == null) {
            label = element.WeekNumber;
            labels.push(label);
        }
        if (set == null) {
            set = { label: element.name, data: [], fill: false, borderColor: color[colorIndex++] };
            datasets.push(set);
        }
        set.data[element.WeekNumber] = element.Visitors;
    });
    var ctx = document.getElementById('myChart').getContext('2d');
    var mixedChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets,
            labels: labels
        },
        options: {
            responsive: true,
            hoverMode: 'index',
            fill: false,
            title: {
                display: true,
                text: 'Activity by course'
            }
        }
    });

    // let labelsPie = []; 
    // let dataPie = [];
    // pieResults.forEach(element => {
    //     switch (element.DaysSinceActivity) {
    //         case value:
                
    //             break;
        
    //         default:
    //             break;
    //     }
    // });
    // var ctx_pie = document.getElementById('myPie').getContext('2d');
    // var pieChart = new Chart(ctx_pie, {
    //     type: 'pie',
    //     data: {
    //         datasets: [{
    //             data: dataPie
    //         }],
    //         labels: labelsPie
    //     },
    //     options: {
    //         responsive: true,
    //         hoverMode: 'index',
    //         fill: false,
    //         title: {
    //             display: true,
    //             text: 'Days since last Activity'
    //         }
    //     }
    // });
}