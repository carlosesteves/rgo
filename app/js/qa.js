$(document).ready(function() {
    initBindings();
});

function initBindings() {
    var project_name = $('.project-name').text();
    if ($('.triangle').length > 0) {
        drawTriangle(project_name);
    }

    if ($('.timeline.system').length > 0) {
        drawTimeline(project_name, 'system');
        drawTimeline(project_name, 'unit');
        drawTimeline(project_name, 'integration');
        drawTimeline(project_name, 'functional');
    }
    if ($('.build-times').length > 0) {
        drawBuildTimes(project_name);
    }

    $('.blink').modernBlink();
}

function drawBuildTimes(project) {
    var url = '/api/' + project + '/build';

    return $.ajax({
        type: 'GET',
        url: url,
        async: true,
        jsonpCallback: 'functionTest',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {

            var jsonObject = JSON.parse(json);
            var chartData =  getTimelineDataFromJsonObject(jsonObject);
            runBuildTimeChart(project, chartData);
        },
        error: function(e) {
            console.log('error');
            console.log(e);
        }
    });
}

function drawTriangle(project_name) {
    var url = '/api/data/' + project_name + '/triangle';
    console.log(url);
    return $.ajax({
        type: 'GET',
        url: url,
        async: true,
        jsonpCallback: 'functionTest',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log('draw triangle');
            $('.pyramid').hide();
            $('.triangle').show();
            var jsonObject = JSON.parse(json);
            if(!jsonObject.integration.number_tests)
                jsonObject.integration.number_tests = 0;

            if(!jsonObject.system.number_tests)
                jsonObject.system.number_tests = 0;

            if(!jsonObject.functional.number_tests)
                jsonObject.functional.number_tests = 0;

            if(!jsonObject.unit.number_tests)
                jsonObject.unit.number_tests = 0;

            console.log(jsonObject);
            console.log(jsonObject['unit']['number_tests']);
            performConversion(jsonObject, $('.triangle').width()); // based on the div width
        },
        error: function(e) {
            console.log('error');
            console.log(e);
        }
    });
}


function drawTimeline(project_name, type) {
    var url = '/api/' + project_name + "/" + type + '/all';
    return $.ajax({
        type: 'GET',
        url: url,
        async: true,
        jsonpCallback: 'functionTest' + type,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            var jsonObject = JSON.parse(json);
            console.log(jsonObject);
            runTimelineChart(project_name, getTimelineDataFromJsonObject(jsonObject), type);
        },
        error: function(e) {
            console.log('error');
            console.log(e);
        }
    });
}


function performConversion(jsonObject, maxWidth) {
    var unitTests = jsonObject['unit']['number_tests'];
    var integrationTests = jsonObject['integration']['number_tests'];
    var systemTests = jsonObject['system']['number_tests'];
    var functionalTests = jsonObject['functional']['number_tests'];

    var unitTime = jsonObject['unit']['time'];
    var integrationTime = jsonObject['integration']['time'];
    var systemTime = jsonObject['system']['time'];
    var functionalTime = jsonObject['functional']['time'];

    var biggest;

    if(unitTests > integrationTests)
        biggest = unitTests;
    else
        biggest = integrationTests;

    if(functionalTests > biggest)
        biggest = functionalTests;

    if(systemTests > biggest)
        biggest = systemTests;

    var realUnitWidth = unitTests * maxWidth / biggest;
    var realIntegrationWidth = integrationTests * maxWidth / biggest;
    var realSystemWidth = systemTests * maxWidth / biggest;
    var realFunctionalWidth = functionalTests * maxWidth / biggest;

    // Set height
    $('.stack.unit').height(unitTime);
    $('.stack.integration').height(integrationTime);
    $('.stack.system').height(systemTime);
    $('.stack.functional').height(functionalTime);

    // Set width
    $('.stack.unit').width(realUnitWidth);
    $('.stack.integration').width(realIntegrationWidth);
    $('.stack.system').width(realSystemWidth);
    $('.stack.functional').width(realFunctionalWidth);

    // Set html data
    $('.stack.unit').html(unitTests);
    $('.stack.integration').html(integrationTests);
    $('.stack.system').html(systemTests);
    $('.stack.functional').html(functionalTests);
}

function getTimelineDataFromJsonObject(jsonObject) {
    var timestampArray  = [];
    var numberTestsArray  = [];
    var totalTimeArray  = [];

    $.each(jsonObject, function(i, item) {
        timestampArray.push(jsonObject[i].build);
        numberTestsArray.push(jsonObject[i].number_tests);
        totalTimeArray.push(jsonObject[i].time);
    });

    return [timestampArray, numberTestsArray, totalTimeArray];
}


function drawPyramid(project_name) {
    var url = '/api/data/' + project_name + '/triangle';
    return $.ajax({
        type: 'GET',
        url: url,
        async: true,
        jsonpCallback: 'functionTest',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            var data = JSON.parse(json);
            if(!data.integration.number_tests)
                data.integration.number_tests = 0;

            if(!data.system.number_tests)
                data.system.number_tests = 0;

            if(!data.functional.number_tests)
                data.functional.number_tests = 0;

            if(!data.unit.number_tests)
                data.unit.number_tests = 0;

            console.log(data);
            $('.triangle').hide();
            $('.pyramid').show();
            $('.pyramid').highcharts({
                chart: {
                    type: 'pyramid',
                    marginRight: 100
                },
                title: {
                    text: 'Core test pyramid',
                    x: -50
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y:,.0f})',
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Number of tests',
                    data: [
                        ['Unit', data.unit.number_tests],
                        ['Integration', data.integration.number_tests],
                        ['System',    data.system.number_tests]
                    ]
                }]
            });
        },
        error: function(e) {
            console.log("nhec");
            console.log('error');
            console.log(e);
        }
    });

}


function runTimelineChart(project, data, test_type) {
    var timestampArray = data[0];
    var numberTestsArray = data[1];
    var totalTimeArray = data[2];

    console.log("Timestamp: " + timestampArray);
    console.log("Number tests: " + numberTestsArray);
    console.log("totalTimeArray: " + totalTimeArray);

    var classname = '.timeline.' + test_type;
   // alert(classname);
    $(classname).highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: test_type
        },
        subtitle: {
            text: 'Test duration vs. Number of ' + test_type + ' tests'
        },
        xAxis: [{
            categories: timestampArray
        }],
        yAxis: [{ // Primary yAxis
            min: 0,
            labels: {
                format: '{value} s',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Duration',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Number of ' + test_type + ' tests',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 0,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'Number of ' + test_type + ' tests',
            type: 'column',
            yAxis: 1,
            data: numberTestsArray,

        }, {
            name: 'Test duration',
            type: 'spline',
            data: totalTimeArray,
            tooltip: {
                valueSuffix: 's'
            }
        }]
    });
}

function runBuildTimeChart(project, data) {
    console.log(data);
    var buildIds  = data[0];
    var times  = data[2];

    $('.build-times').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: 'Build times'
        },
        xAxis: [
            {
            categories: buildIds.reverse()
        }],
        yAxis: {
            min: 0,
            title: {
                text: 'Duration'
            },
            labels: {
                format: '{value} s'
            }
        },
        tooltip: {
            pointFormat: '{series.name} took <b>{point.y:,.0f} s</b><br/>'
        },

        series: [{
            name: 'Build time',
            data: times.reverse()
        }]
    });
}