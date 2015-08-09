$(function() {
	//定义全局变量
	var area_data = '';//保存横向绘制图形数据
	var time_data = '';//保存纵向绘制图形数据
	
	//初始化表单选项
	var datevalue = '';
	var datetype = '';
	datetype = $("#day").val();
	var datevalue = $("#dayvalue").val();


	$('.form_datetime').calendar();
	$("#day").click(function(){
		$("#dayvalue").css("display","inline-block");
		$("#weekvalue").css("display","none");
		$("#monthvalue").css("display","none");
		datetype = $("#day").val();
	});
	$("#week").click(function(){
		$("#dayvalue").css("display","none");
		$("#weekvalue").css("display","inline-block");
		$("#monthvalue").css("display","none");
		datetype = $("#week").val();
	});
	$("#month").click(function(){
		$("#dayvalue").css("display","none");
		$("#weekvalue").css("display","none");
		$("#monthvalue").css("display","inline-block");
		datetype = $("#month").val();
	});

	$("#type").change(function(){
		if($("#type").val()=='area')
		{
			$("#region").hide();
			$("#question").hide();
		}
		else
		{
			$("#region").show();
			$("#question").show();
		}
	
	});

	//初始化显示纵向区域
	$("#content_time").css("display","block");
	$("#contenta").html('<img src="images/load.gif" />');
	$("#contentb").html('<img src="images/load.gif" />');
	var url = '/ajax/feedback'; 
	var arg = {
	type:'time',datetype:'day',datevalue:datevalue,region:0,operator:0,fbsummary:0
	};
	$.getJSON(url,arg,function(data){
		time_data = data;
		draw_line('contenta',time_data.line_data);
		draw_bar('contentb',time_data.bar_data);
	});

	//当省改变时，初始化市
	$("#t_province").change(function(){
		var province_str = $("#t_province").val();
		//alert(province_str);
		$.get('/ajax/getcity',{
		province_str:province_str},function(data){
			$("#t_city").html(data);
		});	
	});


	//绑定省份按钮点击事件
	$('#province').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('#city').removeClass('btn-primary');
		domap_lm('map',area_data.map_province,null,'反馈数量');
		draw_bar_more('contentc',area_data.bar_province);
	});

	//绑定城市按钮点击事件
	$('#city').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('#province').removeClass('btn-primary');
		domap_lm('map',null,area_data.map_city,'反馈数量');
		draw_bar_more('contentc',area_data.bar_city);
	});

	//查询
	$("#search").click(function(){
		if(datetype=='day')
		{
			datevalue = $("#dayvalue").val();
		}
		else if(datetype=='week')
		{
			datevalue = $("#weekvalue").val();
		}
		else if(datetype=='month')
		{
			datevalue = $("#monthvalue").val();
		}
		var type = $("#type").val();
		var fboperator = $("#fboperator").val();
		var fbsummary = $("#fbsummary").val();
		if(type=='area')
		{
			$("#content_time").css("display","none");
			$("#content_area").css("display","block");
			$("#map").html('');
			$("#contentc").html('<img src="images/load.gif" />');
			var url = '/ajax/feedback'; 
			var arg = {
			type:type,datetype:datetype,datevalue:datevalue,fboperator:fboperator
			};
			$.getJSON(url,arg,function(data){
				//alert(data);
				$("#province").removeClass('btn-default').addClass('btn-primary');
				$('#city').removeClass('btn-primary');
				area_data = data;
				domap_lm('map',area_data.map_province,null,'反馈数量');
				draw_bar_more('contentc',area_data.bar_province);
			});
		}
		else if(type == 'time')
		{

			$("#content_area").css("display","none");
			$("#content_time").css("display","block");
			$("#contentb").html('<img src="images/load.gif" />');
			$("#contenta").html('<img src="images/load.gif" />');
			var region = $("#t_city").val();
			var url = '/ajax/feedback'; 
			var arg = {
			type:type,datetype:datetype,datevalue:datevalue,region:region,fboperator:fboperator,fbsummary:fbsummary
			};
			$.getJSON(url,arg,function(data){
				draw_line('contenta',data.line_data);
				draw_bar('contentb',data.bar_data);
			});

		}

	});
	
});
