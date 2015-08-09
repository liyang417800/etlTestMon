<%@ page language="java" 
import="java.util.*,com.etl.etlmonitor.formbean.*,com.etl.etlmonitor.action.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html >
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>ETL-Test测试系统</title>
    <Script Language="javascript">  
        function addcase(id,pagetitle){  
		window.location.href="/etlTestMon/addcaseAction?pageid="+id+"&pagetitle="+pagetitle;  
		}  	
        
		function change(id){  
		window.location.href="/etlTestMon/changeAction?pageid="+id;  
		}  	
		
		function changPage(pageid){
			window.location.href="/etlTestMon/ListAction?pageInt="+pageid;
			
		}
		
		
		function deltest(id){
			var url = "/etlTestMon/delAction?type=Page&id="+id;
			alert(id);
			$.get(url,function(dom){
				 if(dom==1){
				 	//$("#"+id).remove();
				 	window.location.href="/etlTestMon/ListAction";
				 }else{
				 	alert("~~删除失败~~");
				 }
			 }) ; 
		}
		
		function zhixingtest(id){
			var url = "/etlTestMon/zhixingAction?id="+id;
			alert(url);
			$.get(url,function(dom){
				 alert(dom);
			 }) ; 
		}	
		
		function reporttest(id){
			var url = "/etlTestMon/reportAction?id="+id;
			window.location.href=url;
		}	
	</Script>
</head>
<body>
<div id="wrapper">
<jsp:include page="top.jsp"></jsp:include>     
<div id="page-wrapper" style="min-height: 413px;"><div class="container-fluid">
	<div class="row">
    <h4 class="page-header">测试列表</h4> 
    
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">pageid</th>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">pagetitle</th>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">content</th> 
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">提交人</th> 
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">提交时间</th> 
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">添加case</th> 
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">操作</th>                  
                </tr>
            </thead>
            <tbody>
            <%
            	List list = (List)request.getSession().getAttribute("list"); 
            	String pageInt = (String)request.getSession().getAttribute("pageInt"); 
            	if(pageInt==null||pageInt==""||pageInt.equals("")||pageInt.equals("null")){
					pageInt="1";
				}
            	for(int i=0;i<list.size();i++)
            	{
            	TestPageBean hb=(TestPageBean)list.get(i);
            %>         
                    
                    <tr id="<%=hb.getPageid()%>">   
                    <td><a onclick="change('<%=hb.getPageid()%>')"><%=hb.getPageid() %></a></td>
                    <td title="<%=hb.getPagetitle() %>"><%=hb.getPagetitle().length()>25?hb.getPagetitle().substring(0,25):hb.getPagetitle() %></td>
                    <td title="<%=hb.getContent() %>"><%=hb.getContent().length()>25?hb.getContent().substring(0,25):hb.getContent() %></td>
	                <td><%=hb.getDayT()%></td>
	                <td><%=hb.getAuther()%></td>
	                <td><button onclick="addcase('<%=hb.getPageid()%>','<%=hb.getPagetitle()%>')">添加case</button></td>
	                <td>
	                    <button onclick="deltest('<%=hb.getPageid()%>')">删除</button>
	                    <button onclick="change('<%=hb.getPageid()%>')">修改</button>
	                    <button onclick="zhixingtest('<%=hb.getPageid()%>')">执行</button>
	                    <button onclick="reporttest('<%=hb.getPageid()%>')">报告</button></td>    

                </tr>
                <%
            	}
                %>                
            </tbody>
            
        </table>
        <center>
        <a onclick="changPage(1)">首页</a>&nbsp;&nbsp;
        <%if(Integer.parseInt(pageInt)>1){ %>
        <a onclick="changPage('<%=Integer.parseInt(pageInt)-1%>')">上一页</a>&nbsp;&nbsp;
        <%}
        if(list.size()==8){ %>
        <a onclick="changPage('<%=Integer.parseInt(pageInt)+1%>')">下一页</a>&nbsp;&nbsp;
        <%} %>
        (-每页8条-)
        </center>
    </div>
</div>            
</div>

</body>
</html>
<script>
	$("#hdfs").attr("class","active");
</script>