//线形图绘制
function draw_line(id,data)
{
		if(typeof(data.enabled)=="undefined")
		{
			data.enabled = true;
		}
	    $('#'+id).highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: data.text
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: data.categories,
		 labels: {
                    rotation: -90,
                    align: 'right',
                    style: {
                        fontSize: '10px'
                    }
                }
            },
		legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'top',
                x: 0,
                y: 0,
                floating: true,
				enabled: data.enabled,
                backgroundColor: '#FFFFFF',
                borderWidth: 1
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function() {
                        return this.value
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 2,
                        lineColor: '#666666',
                        lineWidth: 0.5
                    }
                }
            },
            series:data.series
        });
}
//绘制条形图
function draw_bar(id,data)
{
	    $('#'+id).highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: data.text
            },
            xAxis: {
                categories: data.categories,
                title: {
                    text: ''
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                },
                plotLines: [{
                    color: 'red', //线的颜色，定义为红色
                    dashStyle: 'ShortDot', //默认值，这里定义为实线
                    value: 480, //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                    width: 1 //标示线的宽度，2px
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,
				enabled: false,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series:data.series
        });
}
//绘制多类型条形图
function draw_bar_more(id,data)
{

		 $('#'+id).highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: data.text
			},
			xAxis: {
				categories: data.categories
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				}
			},
			legend: {
				backgroundColor: '#FFFFFF',
				reversed: true
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: data.series
		});
}
//绘制map
function domap_lm(id, regionDatas,markersData,text){
    var regionDataValues = {
    };
    var _markersData = {
	'markers':null,
	'values':null
    };

    try {
	var mapObject = $('#' + id).vectorMap('get', 'mapObject');
	if (undefined != mapObject) {
	    mapObject.remove();
	}
    }
    catch (err) {
    }
    if(markersData != null){
	_markersData.values = markersData.values;
	_markersData.markers = markersData.markers;
    }
    if (undefined != regionDatas) {
	for (var areaCode in regionDatas) {
	    regionDataValues[areaCode] = regionDatas[areaCode].vv;
	}
    }
    var options = {
	map: 'cn_mill_zh',
	backgroundColor: 'white', // #505050
	zoomOnScroll: false,
	markers: _markersData.markers,
	markerStyle: {
	    initial: {
		fill: '#4DAC26'
	    },
	    hover: {
		cursor: 'pointer'
	    },
	    selected: {
		fill: '#CA0020'
	    }
	},
	onMarkerOver: function(event, code) {
	},
	onMarkerLabelShow: function(evt, tips, code) {
	    tips.html('' + tips.html() + '<br/>'+text+': ' + _markersData.values[code]);
	},
	series: {
	    regions: [{
		values: regionDataValues,
		scale: ['#B4DBF3', '#2B64B4'],
		normalizeFunction: 'polynomial'
	    }],
	    markers: [{
		attribute: 'r',
		scale: [5, 15],
		values: _markersData.values
	    }]
	},
	regionStyle: {
	    initial: {
		fill: '#B4DBF3',
		"fill-opacity": 1,
		stroke: 'none',
		"stroke-width": 0,
		"stroke-opacity": 1
	    },
	    hover: {
		"fill-opacity": 1,
		fill: '#FFFF00'
	    },
	    selected: {
		fill: 'yellow'
	    },
	    selectedHover: {
	    }
	},
	onRegionLabelShow: function(event, label, code) {
	    var count = "未知";
	    var rank = "未知";
	    if(!regionDatas){
		return;
	    }
	    if (regionDatas && regionDatas[code] && undefined != regionDatas[code]) {
		count = regionDatas[code].vv;
		rank = '<span style="font-weight:bold;">' + regionDatas[code].rank + '</span>';
	    }
	   // label.html('' + label.html() + '<br/>排名: ' + rank + '<br/>在线观看人数: ' + count);
	   label.html('' + label.html() + '<br/>'+text+': ' + count);
	}
    };
    $('#' + id).vectorMap(options);
    // 隐藏放大缩小按钮
    $("div[class='jvectormap-zoomin']").hide();
    $("div[class='jvectormap-zoomout']").hide();
}