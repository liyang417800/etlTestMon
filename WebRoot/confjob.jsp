<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.sql.*,java.util.Date,java.text.SimpleDateFormat"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
//String url="jdbc:mysql://10.155.1.12:3306/test?useUnicode=true&amp;characterEncoding=utf-8";
//String user="hive";
//String password="hive";

String url="jdbc:mysql://localhost:3306/scheduler?useUnicode=true&amp;characterEncoding=utf-8";
String user="root";
String password="root";

Class.forName("com.mysql.jdbc.Driver");
//获得Connection对象
Connection DBConn = DriverManager.getConnection(url,user,password);
PreparedStatement ps=null;
PreparedStatement jobps=null;
String confsql = "select job.system_IDENTIFIER,conf.system_IDENTIFIER,conf.IDENTIFIER,job.IDENTIFIER,job.type,conf.name,job.SUBMITTER as SUBMITTER,job.SUBMIT_TIME as SUBMIT_TIME,job.LAUNCH_TIME as LAUNCH_TIME,job.FINISH_TIME as FINISH_TIME,job.status as status,conf.CONTENT as CONTENT from SCHD_JOB job,SCHD_JOB_CONF conf where job.CONF_IDENTIFIER=conf.IDENTIFIER and job.type=\'compound\' and job.status=\'run\' group by conf.IDENTIFIER,job.type,conf.name,job.SUBMITTER,job.status order by job.SUBMIT_TIME desc";
String jobsql = "select job.IDENTIFIER as IDENTIFIER,job.type as type,conf.name as name,job.SUBMITTER as SUBMITTER,job.status as status from SCHD_JOB job,SCHD_JOB_CONF conf where job.CONF_IDENTIFIER=conf.IDENTIFIER and job.status=\'run\' and job.type=\'cmd\'  group by conf.IDENTIFIER,job.type,conf.name,job.SUBMITTER,job.status order by job.SUBMIT_TIME desc";
ResultSet rs = null;
ResultSet jobrs = null;

SimpleDateFormat dateformat=new SimpleDateFormat("MM/dd hh:mm:ss");

 %>
 
<script type="text/javascript">
function stop(){
	$("#popdiv").hide();
	$("#fade").hide();
}
function jobList(id,type){
	url = "joblist.jsp?parameid="+id;
	if(type=="chart"){
		url = "jobchart.jsp?parameid="+id;
	}
	$("#joblistfrme").attr("src",url);
	$("#popdiv").show();
	$("#fade").show();
}


</script>
<style>

.right{margin-right:10px;float:right;}
.center{display:block;text-align:center;text-decoration:none;}

.black_overlay{
display: none;
position: absolute;
top: 0%;
left: 0%;
width: 100%;
height: 100%;
background-color: #d4d4d4;
z-index:1000;
-moz-opacity: 0.8;
opacity:.80;
filter: alpha(opacity=80);
}

.white_content {
display: none;
position: absolute;
top: 10%;
left: 10%;
width: 80%;
height: 80%;
border: 2px solid lightblue;
background-color: white;
z-index:1002;
overflow: none;
}
.white_contentif{
width: 98%;
height: 90%;
background-color: white;

}
.white_contentifs{
margin-top: 2%;
pading-left: 10%;
width: 98%;
height: 95%;
}

</style>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 	<title>DYC数据监察监控系统</title>
</head>
<body>
<div id="wrapper">
<!-- Navigation -->
<jsp:include page="top.jsp"></jsp:include>
<!--Navigation end  -->
	<div id="page-wrapper" style="min-height: 413px;">
		<div class="container-fluid">
			<div class="row">
		    	<h4 class="page-header">复合任务执行情况</h4>
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
			                    <th>Status</th>
			                </tr>
			            </thead>
			            <tbody>
							<%
							try {
								ps = DBConn.prepareStatement(confsql);
								rs = ps.executeQuery();
								while(rs.next()){
								Long datecha = new Date().getTime()-Long.parseLong(rs.getString("LAUNCH_TIME"));
								Long hour = (datecha / 1000 / 60 / 60) % 24;
								Long min = (datecha / 1000 / 60) % 60;
								Long sec = (datecha / 1000) % 60; 
								Long day = datecha / 1000 / 60 / 60 / 24;
								String runtime= (day==0?"":day)+" "+hour+":"+min+":"+sec;
							%>
			                <tr>
			                    <td title="<%=rs.getString("IDENTIFIER") %>"><%=rs.getString("name") %></td>
			                    <td><%=rs.getString("SUBMITTER") %></td>
			                    <td><%=dateformat.format(Long.parseLong(rs.getString("SUBMIT_TIME"))) %></td>
			                    <td><%=dateformat.format(Long.parseLong(rs.getString("LAUNCH_TIME"))) %></td>
			                    <td><%=(Long.parseLong(rs.getString("LAUNCH_TIME"))-Long.parseLong(rs.getString("SUBMIT_TIME")))/(60*60*1000)+"s"%></td>
			                    <td><%=runtime%></td>
			                    <td><%=rs.getString("status") %></td>
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
			</div>            
		
	<!-- 单任务列表 -->
	
			<div class="row">
		    	<h4 class="page-header">单任务执行情况</h4>
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
			                    <th>Status</th>
			                </tr>
			            </thead>
			            <tbody>
							<%
							try {
								jobps = DBConn.prepareStatement(jobsql);
								jobrs = jobps.executeQuery();
								while(jobrs.next()){
							%>
			                <tr>
			                   <td><%=jobrs.getString("name") %></td>
			                    <td><%=jobrs.getString("SUBMITTER") %></td>
			                    <td><%=jobrs.getString("SUBMITTER") %></td>
			                    <td><%=jobrs.getString("SUBMITTER") %></td>
			                    <td><%=jobrs.getString("SUBMITTER") %></td>
			                    <td><%=jobrs.getString("SUBMITTER") %></td>
			                    <td><%=jobrs.getString("status") %></td>
			                </tr>
			                <%
										}	
									} catch (SQLException e) {
										e.printStackTrace();
									}finally {
										DBConn.close();
									}
							%>
			            </tbody>
			        </table>
		    	</div>
			</div>            
		</div>
	</div>
</div>


<!-- 浮层 -->
<div id="fade" class="black_overlay">
</div>
<div id="popdiv" class="white_content" style="display:none">
	<div class="white_contentifs"><iframe class="white_contentif" id="joblistfrme" src=""  frameborder="no" border="0" marginwidth="0" marginheight="0"  allowtransparency="yes"></iframe>
	<div style="margin-top:10px;"><center><button onclick="stop()">确定</button></center></div>
	</div> 
</div>
<!-- 浮层end -->
</body>
</html>
<script>
$("#job").attr("class","active");
</script>