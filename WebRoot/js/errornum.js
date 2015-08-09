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
			$("#error_group").hide();
		}
		else
		{
			$("#region").show();
			$("#error_group").show();
		}
	
	});

	//初始化显示纵向区域
	$("#content_time").css("display","block");
	$("#contenta").html('<img src="images/load.gif" />');
	$("#contentb").html('<img src="images/load.gif" />');
	var url = '/ajax/errornum'; 
	var arg = {
	type:'time',datetype:'day',datevalue:datevalue,error_type:0,region:0,operator:0,opsys:0,browser:0,bitrate:0,loadway:0
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
		domap_lm('map',area_data.map_province,null,'报错数');
		draw_bar_more('contentc',area_data.bar_province);
	});

	//绑定城市按钮点击事件
	$('#city').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('#province').removeClass('btn-primary');
		domap_lm('map',null,area_data.map_city,'报错数');
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
		var operator = $("#operator").val();
		var opsys = $("#opsys").val();
		var browser = $("#browser").val();
		var bitrate = $("#bitrate").val();
		var loadway = $("#loadway").val();
		if(type=='area')
		{
			$("#content_time").css("display","none");
			$("#content_area").css("display","block");
			$("#map").html('');
			$("#contentc").html('<img src="images/load.gif" />');
			var url = '/ajax/errornum'; 
			var arg = {
			type:type,datetype:datetype,datevalue:datevalue,operator:operator,opsys:opsys,browser:browser,bitrate:bitrate,loadway:loadway
			};
			$.getJSON(url,arg,function(data){
				//alert(data);
				$("#province").removeClass('btn-default').addClass('btn-primary');
				$('#city').removeClass('btn-primary');
				area_data = data;
				domap_lm('map',area_data.map_province,null,'报错数');
				draw_bar_more('contentc',area_data.bar_province);
			});
		}
		else if(type == 'time')
		{
			if(datetype != 'day')
			{
				$("#contenta").css("min-width","800px");
			}
			$("#content_area").css("display","none");
			$("#content_time").css("display","block");
			$("#contenta").html('<img src="images/load.gif" />');
			$("#contentb").html('<img src="images/load.gif" />');
			var region = $("#t_city").val();
			var error_type = $("#error_type").val();
			var url = '/ajax/errornum'; 
			var arg = {
			type:type,datetype:datetype,datevalue:datevalue,error_type:error_type,region:region,operator:operator,opsys:opsys,browser:browser,bitrate:bitrate,loadway:loadway
			};
			$.getJSON(url,arg,function(data){
				draw_line('contenta',data.line_data);
				draw_bar('contentb',data.bar_data);
			});

		}

	});
	
});