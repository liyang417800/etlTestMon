$(function() {
	//定义全局变量
	var area_data = '';//保存横向绘制图形数据
	
	//ajax 初始化流畅率横向画图
	$("#bar").html('<img src="images/load.gif" />');
	var url = '/ajax/smoothrate';
	var arg = {
	type:'area',datetype:'day',datevalue:0,operator:0,opsys:0,browser:0,bitrate:0,loadway:0
	};
	$.getJSON(url,arg,function(data){
		area_data = data;
		domap_lm('map',area_data.map_province,null,'流畅率');
		draw_bar('bar',area_data.bar_province);
	});


	//绑定省份按钮点击事件
	$('#province').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('#city').removeClass('btn-primary');
		domap_lm('map',area_data.map_province,null,'流畅率');
		draw_bar('bar',area_data.bar_province);
	});

	//绑定城市按钮点击事件
	$('#city').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('#province').removeClass('btn-primary');
		domap_lm('map',null,area_data.map_city,'浏览率');
		draw_bar('bar',area_data.bar_city);
	});

	//画流畅率线性形图
	$("#containerA").html('<img src="images/load.gif" />');
	var url = '/ajax/indexline';
	var arg = {
	type:'time',datetype:'day',datevalue:0,region:0,operator:0,opsys:0,browser:0,bitrate:0,loadway:0
	};
	$.getJSON(url,arg,function(data){
		draw_line('containerA',data);
	});

});