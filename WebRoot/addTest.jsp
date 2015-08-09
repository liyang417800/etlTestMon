<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.sql.*,java.util.Date,java.text.SimpleDateFormat"%>
<%@ page import="java.util.*,com.etl.etlmonitor.formbean.TestBean"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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

function add(){  
		document.addForm.action="/etlTestMon/addAction";  
		document.addForm.submit();  
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
 	<title>ETL-Test监控系统</title>
</head>
<body>
<div id="wrapper">
<!-- Navigation -->
<jsp:include page="top.jsp"></jsp:include>
<!--Navigation end  -->
	<div id="page-wrapper" style="min-height: 413px;">
		<div class="container-fluid">
			<div class="row">
		    	<h4 class="page-header">添加测试case</h4>
		    	<form action="/etlTestMon/addAction" method="post" name="addForm">
		    	<div class="table-responsive">
			        <table class="table table-striped table-bordered table-hover">
			            <thead>
			                <tr>
			                    <th>title</th><td><input type="text"  style="width: 500px" name="title" id="title" required="required" >
			                    
			                    </td>
			                </tr>
			                <tr>
			                    <th>sql-1</th><td><textarea rows="8" cols="80" name="contenta" required="required" ></textarea></td>
			                </tr>
			                <tr>
			                    <th>sql-2</th><td><textarea rows="8" cols="80"  name="contentb" required="required" ></textarea></td>
			                </tr>
			                <tr>
			                    <th>checkcase</th><td><textarea rows="3" cols="80"  name="checkcase" required="required" ></textarea></td>
			                </tr>
			                <tr>
			                    <th>提交人</th><td><input type="text" name="auther" id="auther" required="required" ></td>
			                </tr>
			                 <tr>
			                    <td colspan="3"><center><input type="submit"></center></td>
			                </tr>
			            </thead>
			        </table>
		    	</div>
		    </form>
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