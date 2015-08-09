<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.sql.*,java.net.*,java.util.*,java.text.*,java.io.*,java.net.*"%>
<%@ page import="net.sf.json.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
String url="jdbc:mysql://10.155.1.12:3306/test?useUnicode=true&amp;characterEncoding=utf-8";
String user="hive";
String password="hive";
Class.forName("com.mysql.jdbc.Driver");
//获得Connection对象
Connection DBConn = DriverManager.getConnection(url,user,password);
PreparedStatement ps=null;
PreparedStatement jobps=null;
String parameid = request.getParameter("parameid")==null?"":request.getParameter("parameid").trim();
String confsql = "select * from monitortest where city_id="+parameid +" limit 10;";
ResultSet rs = null;
ResultSet jobrs = null;
 %>
<html>
<head>
<jsp:include page="common.jsp"></jsp:include>
<style type="">
body {
    background-color: #ffffff;
}
</style>
</head>
<body>
<!-- Navigation -->
		<div class="container-fluid">
			<div class="">
		    	<h4 class="page-header">任务运行情况</h4>
		    	<div class="table-responsive">
			        <table class="table table-striped table-bordered table-hover">
			            <thead>
			                <tr>
			                    <th>Name</th>
			                    <th>Submitter</th>
			                    <th>SubmitTime</th>
			                    <th>LaunchTime</th>
			                    <th>WaitTime</th>
			                    <th>RunTime</th>
			                    <th>TotalTime</th>
			                    <th>Status</th>
			                </tr>
			            </thead>
			            <tbody>
							<%
							try {
								ps = DBConn.prepareStatement(confsql);
								rs = ps.executeQuery();
								while(rs.next()){
							%>
			                <tr>
			                    <td><%=rs.getString("city_id") %></td>
			                    <td>0.00 s</td>
			                    <td>0.00 s</td>
			                    <td>0.00 s（0.00 %）</td>
			                    <td>0.00 s</td>
			                    <td>0.00 s（0.00 %）</td>
			                    <td>0.00 s</td>
			                    <td><a onclick="jobList('<%=rs.getString("city_id") %>')">运行中</a></td>
			                    
			                </tr>
			                <%
										}	
									} catch (SQLException e) {
										e.printStackTrace();
									}
							%>
			            </tbody>
			        </table>
			</div>            
</body>
</html>
