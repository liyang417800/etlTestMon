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
    <Script Language="text/javascript">  
		   function changeCase(id){
		      	var url = "/etlTestMon/CaseListAction?id="+id;
		    	$.getJSON(url,function(dom){
		    			var obj = dom;
						 $('#id').val(obj.id);
						  $('#contenta').val(obj.cona);
						   $('#contentb').val(obj.conb);
						    $('#auther').val(obj.auther);
						     $('#title').val(obj.title);
						     $('#checkcase').val(obj.checkcase);
					 })
			}
	
		function deltest(id,Pageid){
			var url = "/etlTestMon/delAction?type=Case&id="+id;
			$.get(url,function(dom){
				 if(dom==1){
				 	//$("#"+id).remove();
				 	window.location.href="/etlTestMon/addcaseAction?pageid="+Pageid;
				 }else{
				 	alert("~~删除失败~~");
				 }
			 }) ; 
		}
		
</script>
</head>
<body>
<div id="wrapper">
<jsp:include page="top.jsp"></jsp:include>     
<div id="page-wrapper" style="min-height: 413px;"><div class="container-fluid">
	<div class="row">
	 <%
       String pagetitle = (String)request.getAttribute("pagetitle"); 
	   String pageid = (String)request.getAttribute("pageid");
     %>         
    <h4 class="page-header"><%=pagetitle%></h4> 
    
    <div class="table-responsive">
    
    
    
        <table class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">caseid</th>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">casetitle</th>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">sql1</th>
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">sql2</th> 
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">提交人</th> 
                    <th  style="text-align:center; vertical-align:middle; line-height:24px">提交时间</th>
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
            	TestBean hb=(TestBean)list.get(i);
            %>         
                    
                    <tr id="<%=hb.getId()%>">   
                    <td><a onclick="change('<%=hb.getId()%>')"><%=hb.getId() %></a></td>
                    <td title="<%=hb.getTitle() %>"><%=hb.getTitle().length()>25?hb.getTitle().substring(0,25):hb.getTitle() %></td>
                    <td title="<%=hb.getContenta() %>"><%=hb.getContenta().length()>25?hb.getContenta().substring(0,25):hb.getContenta() %></td>
                    <td title="<%=hb.getContentb() %>"><%=hb.getContentb().length()>25?hb.getContentb().substring(0,25):hb.getContentb() %></td>
	                <td><%=hb.getAuther() %></td>
	                <td><%=hb.getdayT()%></td>
	                <td>
	                    <button onclick="deltest('<%=hb.getId()%>','<%=pageid%>')">删除</button>
	                    <button onclick="changeCase('<%=hb.getId()%>')">修改</button>  

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
        
        			<form action="/etlTestMon/addAction" method="post" name="addForm">
        			<input type=""  name="pageid" value="<%=pageid%>" style="display:none">
        			<input type=""  name="id" id="id" style="display:none">
			        <table class="table table-striped table-bordered table-hover">
			            <thead>
			                <tr>
			                    <th>title</th><td>
			                    <select name="title" id="selecttitle" required="required" ><option value="数据量检查" selected="selected">数据量检查</option>
			                    		<option value="数据diff检查">数据diff检查</option>
			                    		<option value="合法性检查">合法性检查</option>
			                    		<option value="类型检查">类型检查</option>
			                    		<option value="取值分布检查">取值分布检查</option>
			                    		<option value="业务逻辑检查">业务逻辑检查</option>
			                    		
			                    </select>
			                    </td>
			                </tr>
			                <tr>
			                    <th>sql-1</th><td><textarea rows="8" cols="80" name="contenta"  id="contenta" required="required" ></textarea></td>
			                </tr>
			                <tr id="sql2">
			                    <th>sql-2</th><td><textarea rows="8" cols="80"  name="contentb" id="contentb" required="required" ></textarea></td>
			                </tr>
			                <tr>
			                    <th>checkcase</th><td>
			                    	<select name="checkcase" id="checkcase" required="required" >
			                    		<option value="sql1[0][0] == sql2[0][0]" selected="selected" title="判断sql1语句返回的第0行第0列元素和sql2返回的第0行第0列元素是否相同">sql1[0][0] == sql2[0][0]</option>
			                    		<option value="sql1 == sql2" title="判断sql1返回和sql2返回是否相同。要求返回列数和行数，以及内容完全一致">sql1 == sql2</option>
			                    		<option value="sql1.col[0].type == int" title="判断sql1返回的第0列的所有元素都是整数类型">sql1.col[0].type == int</option>
			                    		<option value="sql1.col[1].type == str" title="判断sql1返回的第1列的所有元素都是字符串类型">sql1.col[1].type == str</option>
			                    		<option value="sql1.col[1] != NULL" title="判断sql1返回的第1列的所有元素都不为NULL">sql1.col[1] != NULL</option>
			                    		<option value="sql1.col[1] == NULL" title="判断sql1返回的第1列的所有元素都为NULL">sql1.col[1] == NULL</option>
			                    		<option value="0 < sql1[0][1]" title="判断sql1返回的第0行，第1列元素大于0">0 < sql1[0][1]</option>
			                    		<option value="sql1 != NULL" title="判断sql返回结果不为NULL">sql1 != NULL</option>
			                    		<option value="sql1 == NULL" title="判断sql返回结果为NULL，或无返回">sql1 == NULL</option>
			                    		<option value='sql1.show("show1")' title="将sql1的返回结果打印到show1文件中。show1文件名，可随意指定">sql1.show("show1")</option>
			                    		<option value='sql1.col[0].show("show2") ' title="将sql1的第0列打印到show2文件中。show1文件名，可随意指定">sql1.col[0].show("show2") </option>
			                    		<option value="sql1.col[0].type == float" title="将判断sql1返回的第0列的所有元素都是小数类型">sql1.col[0].type == float</option>
			                    		<option value="sql1.col[0]>=0 sql1.col[0]<=10" title="判断sql1返回的第0列的所有元素的范围为0到10">sql1.col[0]>=0 sql1.col[0]<=10</option>
			                    </select>
			                    </td>
			                </tr>
			                <tr>
			                    <th>提交人</th><td><input type="text" name="auther" id="auther" required="required" ></td>
			                </tr>
			                 <tr>
			                    <td colspan="3"><center><input type="submit"></center></td>
			                </tr>
			            </thead>
			        </table>
		    </form>
 </div>          
</div>
</div>
</body>
</html>
<script>
	$("#hdfs").attr("class","active");
	$(function(){
			$('#selecttitle').change(function(){
				var valuetitle=$('#selecttitle').val();
				if(valuetitle=='数据量检查'||valuetitle=='数据diff检查'){
					$("#sql2").show();				
				}else{
					$("#sql2").hide();	
					$("#contentb").attr("required",false);			
				}
			})
		})
</script>
