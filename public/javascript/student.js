window.onload = function () {
    let  color = ["red", "orange", "yellow", "green", "blue", "purple", "grey"];
    let colorIndex = 0;
    let datasets = [];
    labels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
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
        set.data[element.WeekNumber] = element.Visits;
    });
    datasets.forEach(element => {
        for (let index = 0; index < labels.length; index++) {
            if(element.data[index] == null){
                element.data[index] = 0;
            }
            
        }
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
}