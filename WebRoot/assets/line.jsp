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
  	
  	Connection conn = null;
	PreparedStatement stmt = null;
	ResultSet rs = null;		
	
	try{
		Class.forName("oracle.jdbc.driver.OracleDriver");
	}
	catch(ClassNotFoundException ce){
		out.println(ce.getMessage());
	}
	    
	String url="jdbc:oracle:thin:@10.103.23.102:1521:orcl";
	conn=DriverManager.getConnection(url,"hdfsmonitor","youku001");
	stmt=conn.prepareStatement("select REGEXP_SUBSTR(t.hdfs_path, '[^/]+', 37, 1, 'c') as table_name,file_count,round(t.file_size / 1024 / 1024 / 1024, 2),t.hdfs_date from DATA_HDFSMONITOR t where to_date(t.hdfs_date,'YYYYMMDD') between (sysdate - 10) and sysdate and REGEXP_SUBSTR(t.hdfs_path, '[^/]+', 37, 1, 'c') = 'l_web_tcomvvlog_rcfile' order by t.hdfs_date");	    
	rs=stmt.executeQuery();
	String title = "";
	String xData = "[";	
	String yData = ", data: [";
	while(rs.next()){
		title=rs.getString(1);
		xData+= rs.getString(4)+",";
		yData+= rs.getString(3)+",";
	}
	xData = xData.substring(0, xData.length()-1);
	xData+= "]";
	yData=yData.substring(0, yData.length()-1);	
	yData = "[{name: '"+ title +"' "+ yData + "]}]";
	rs.close();
	stmt.close();
	conn.close();
	System.out.println(xData);
	System.out.println(yData);
	%>
  <script type="text/javascript">
  		var charttype='spline';
		var titletext = 'HDFS文件监控';
		
		var atra = "<%=xData%>";
		var atraaa = "<%=yData%>";
		
		var bok = strToJson(atra);
		var option1 = strToJson(atraaa);
		
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

			xAxis: {
					categories: bok,
        	},            
        	yAxis: {       			
        			title: {text: '数据大小(MB)'},        			
        	}, 
        	legend: legend,
        	series: option1                
        });
    });	    
  </script>  

</head>
	<form action="/dycMonitor/hdfsAction">
		<input type="submit" value="返回查询界面">
	</form>	
	<body>
		<div id="container"></div>
	</body>
</html>