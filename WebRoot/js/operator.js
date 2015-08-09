$(function() {
		   
	//初始化表单选项
	var datevalue = '';
	var datetype = '';
	datetype = $("#week").val();
	var datevalue = $("#weekvalue").val();

	$("#week").click(function(){
		$("#weekvalue").css("display","inline-block");
		$("#monthvalue").css("display","none");
		datetype = $("#week").val();
	});
	$("#month").click(function(){
		$("#monthvalue").css("display","inline-block");
		$("#weekvalue").css("display","none");
		datetype = $("#month").val();
	});

	$("#type").change(function(){
		if($("#type").val()=='area')
		{
			$("#region").hide();
		}
		else
		{
			$("#region").show();
		}
	});

	//初始化显示
	$("#contenta").html('<img src="images/load.gif" />');
	var url = '/ajax/operator'; 
	var arg = {
	datetype:'week',datevalue:datevalue,region:0
	};
	$.getJSON(url,arg,function(data){
		bar('contenta',data);
	});
	
	
	//当省改变时，初始化市
	$("#t_province").change(function(){
		var province_str = $("#t_province").val();
		$.get('/ajax/getcity',{
		province_str:province_str},function(data){
			$("#t_city").html(data);
		});	
	});

	//查询
	$("#search").click(function(){
		if(datetype=='week')
		{
			datevalue = $("#weekvalue").val();
		}
		else if(datetype=='month')
		{
			datevalue = $("#monthvalue").val();
		}

		$("#contenta").html('<img src="images/load.gif" />');
		var region = $("#t_city").val();
		var url = '/ajax/operator'; 
		var arg = {
		datetype:datetype,datevalue:datevalue,region:region
		};
		$.getJSON(url,arg,function(data){
			bar('contenta',data);
		});
		
	});
	
});

function bar(id,data)
{	  
  	$('#'+id).highcharts({
			chart: {
				type: 'column',
				margin: [ 50, 50, 100, 80]
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
					rotation: -45,
					align: 'right',
					style: {
						fontSize: '14px',
						color:'#000000',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				pointFormat: '<b>{point.y:.1f} %</b>'
			},
			series: [{
				name: data.name,
				data: data.data,
				dataLabels: {
					enabled: true,
					color: '#333',
					formatter: function() {
						return this.y +'%';
					},
					style: {
						fontSize: '10px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			}]
		});
}