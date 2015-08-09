<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.util.Date"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.sql.*"%>
<%@page import="java.util.List"%>
<head>
  <script type="text/javascript" src="../assets/js/jquery-1.8.3.min.js"></script>
  <script type="text/javascript" src="../assets/Highcharts-4.0.3/js/highcharts.js"></script>
  <script type="text/javascript" src="../assets/Highcharts-4.0.3/js/modules/exporting.js"></script>  
  <%
  	String url="jdbc:mysql://10.155.1.12:3306/test?useUnicode=true&amp;characterEncoding=utf-8";
	String user="hive";
	String password="hive";
	Class.forName("com.mysql.jdbc.Driver");
	//获得Connection对象
	Connection DBConn = DriverManager.getConnection(url,user,password);
	PreparedStatement ps=null;
	String confsql = "select distinct city_id,min(a) as a from test.monitortest group by city_id limit 10;";
	ResultSet rs = null;
	ps = DBConn.prepareStatement(confsql);
	rs = ps.executeQuery();
	String xData = "[";	
	String yData = "name:['执行时间'],data: [";
	while(rs.next()){
		xData+= rs.getString("city_id")+",";
		yData+= rs.getString("a")+",";
	}
	xData = xData.substring(0, xData.length()-1);
	xData+= "]";
	yData=yData.substring(0, yData.length()-1);	
	yData = "[{"+ yData + "]}]";
	rs.close();
	DBConn.close();
	%>
  <script type="text/javascript">
  		var charttype='spline';
		var titletext = 'job执行时长曲线图';
		var xData = "<%=xData%>";
		var yData = "<%=yData%>";
		var xoption = strToJson(xData);
		var optiondata = strToJson(yData);
		var legendjson = "{layout:'vertical',align:'right',verticalAlign:'middle'}";
		var legend = strToJson(legendjson);
		function strToJson(str){
			var obj = eval('(' + str + ')');
			return obj
		}
		
		$(function () {
        	$('#container').highcharts({
        	chart: { type: charttype },
            title: {text: titletext},
			xAxis: {categories: xoption},            
        	yAxis: {  title: {text: '使用时间 min'}}, 
        	series: optiondata                
        });
    });	    
  </script>  

</head>
	<body>
		<div id="container" height="80%" width="80%"></div>
	</body>
</html>