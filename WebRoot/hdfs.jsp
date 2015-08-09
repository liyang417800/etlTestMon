<%@ page language="java" 
import="java.util.*,com.youku.dycmonitor.formbean.HdfsBean" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html >
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>DYC数据监察监控系统</title>
    <Script Language="javascript">  
		function search(){  
		document.HdfsForm.action="/dycMonitor/hdfsAction";  
		document.HdfsForm.submit();  
		}  		
		function updata(){  
		document.HdfsForm.action="/dycMonitor/hdfsRefresh";  
		document.HdfsForm.submit();  
		}  		
	</Script>
</head>
<body>
<div id="wrapper">
<jsp:include page="top.jsp"></jsp:include>     
<div id="page-wrapper" style="min-height: 413px;"><div class="container-fluid">
	<div class="row">
    <h4 class="page-header">HDFS日志情况</h4> 
    <form action="" method="get" name="HdfsForm">
    <h4>
    	<%
    		String hdfs_pathValue=(String)request.getSession().getAttribute("hdfs_pathValue");
    		String hdfs_dateValue=(String)request.getSession().getAttribute("hdfs_dateValue");
    	 %>    	 
    		路径<input type="text" name="path"
    	<%    		
    	 	if(hdfs_pathValue!=null){
    	 %>	
    		 value="<%=hdfs_pathValue%>" 
    	<%    		
    		} 
    	 %>	 
    		 required="required">    	     	 	
    	时间<input type="text" name="hdfs_date" 
    	<%    		
    	 	if(hdfs_dateValue!=null){
    	 %>
    	value="<%=hdfs_dateValue%>" 
    	<%
    	   }else{
    	   java.text.SimpleDateFormat formatter=new java.text.SimpleDateFormat("yyyyMMdd");
     	   java.util.Date Now=new java.util.Date();
     	   java.util.Date yesterday=new java.util.Date(new java.util.Date().getTime()-24*60*60*1000);     	   
           String time=formatter.format(yesterday);
    	 %>
    	 value="<%=time%>"
    	 <%  
    	   }
    	  %>
    	required="required">    	 
    	<input type="button" onclick="search()" value="查询">
    	<input type="button" onclick="updata()" value="更新数据">    	
    </h4>
    </form>                
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th rowspan="2" style="text-align:center; vertical-align:middle; line-height:24px">数据文件路径</th>
                    <th   style="text-align:center; vertical-align:middle; line-height:24px">文件个数</th>
                    <th colspan="3" style="text-align:center; vertical-align:middle; line-height:24px">文件大小</th>                    
                </tr>
                <tr>
                	<th style="text-align:center; vertical-align:middle; line-height:24px">今天(个)</th>
                    <th style="text-align:center; vertical-align:middle; line-height:24px">昨日(个)</th>
                	<th style="text-align:center; vertical-align:middle; line-height:24px">今天(MB)</th>
                    <th style="text-align:center; vertical-align:middle; line-height:24px">昨日(MB)</th>
                    <th style="text-align:center; vertical-align:middle; line-height:24px">上周同期(MB)</th>
                </tr>
            </thead>
            <tbody>
            <%
            	List list = (List)request.getSession().getAttribute("list");  
            	for(int i=0;i<list.size();i++)
            	{
            	HdfsBean hb=(HdfsBean)list.get(i);
            	Integer count1 = hb.getFilecount()==null?0:Integer.parseInt(hb.getFilecount());
            	Integer count2 = hb.getTbcount()==null?0:Integer.parseInt(hb.getTbcount());
            	Double judge1;
            	if(count2 != 0){
            		judge1 = Math.abs((double)((count1-count2)/count2));
            	}else{
            		judge1 = 0.05;
            	}
            	Double count3 = hb.getFilesize()==null?0:Double.parseDouble(hb.getFilesize());
            	Double count4 = hb.getTbsize()==null?0:Double.parseDouble(hb.getTbsize());
            	Double judge2;
            	if(count4 != 0){
            		judge2 = Math.abs(((count3-count4)/count4));
            	}else{
            		judge2 = 0.05;
            	}            	            	
            %>            
                <tr>
                    <td><%=hb.getTable() %></td>                   
                    <%
                    	if(judge1>=0.05){
                    	
                    %>
	                    <td style="color:#FF6600;">
	                    <%=hb.getFilecount()==null?0:Integer.parseInt(hb.getFilecount())%>
	                    </td>
                    <%
                    	}else{
                    %>
                    	<td>
	                    <%=hb.getFilecount()==null?0:Integer.parseInt(hb.getFilecount())%>
	                    </td>
                    <%
                    	}
                    %>
	                <td>
	                <%=hb.getTbcount()==null?0:Integer.parseInt(hb.getTbcount())%>
	                </td> 
	                <%
                    	if(judge2>=0.05){
                    	
                    %>                                                      
	                    <td style="color:#FF6600;">
	                    <%=hb.getFilesize()==null?0:Double.parseDouble(hb.getFilesize())%>
	                    </td>
                    <%
                    	}else{
                    %>
	                    <td>
	                    <%=hb.getFilesize()==null?0:Double.parseDouble(hb.getFilesize())%>
	                    </td>
                    <%
                    	}
                    %>
                    <td>
                    <%=hb.getTbsize()==null?0:Double.parseDouble(hb.getTbsize())%>
                    </td>                    
                    <td>
                    <%=hb.getSzsize()==null?0:Double.parseDouble(hb.getSzsize())%>
                    </td>
                </tr>
                <%
            	}
                %>                
            </tbody>
        </table>
    </div>
</div>            
</div>

</body>
</html>
<script>
	$("#hdfs").attr("class","active");
</script>