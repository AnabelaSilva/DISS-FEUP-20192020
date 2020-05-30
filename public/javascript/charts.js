
window.onload = function () {

    let datasets = [];
    labels = [];
    results.forEach(element => {
        console.log(element.name);
        let set = datasets.find(el => {return el.label == element.name;});
        let label = labels.find(el => {return el == element.WeekNumber;});
        if(label == null){
            label =  element.WeekNumber;
            labels.push(label);
        }
        if(set == null){
            set = { label: element.name, data:[]};
            datasets.push(set);
        }
        set.data[element.WeekNumber]= element.Visitors;
    });
    console.log(labels);
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
            },
            
    }});
}