<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html >
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>ETL-TEST 测试系统</title>
</head>
<body>
<div id="wrapper">
<!-- Navigation -->
<jsp:include page="top.jsp"></jsp:include>
<!--Navigation end  -->
<div id="page-wrapper" style="min-height: 413px;"><div class="container-fluid">
<div class="row">
    <h4 class="page-header">HDFS日志情况</h4>
    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th></th>
                    <th>数据表</th>
                    <th>日志目录</th>
                    <th>文件个数</th>
                    <th>文件大小</th>
                    <th>较昨日</th>
                    <th>较上周同期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>今日</td>
                    <td>0.00 s</td>
                    <td>0.00 s</td>
                    <td>0.00 s（0.00 %）</td>
                    <td>0.00 s</td>
                    <td>0.00 s（0.00 %）</td>
                    <td>0.00 s</td>
                    <td>查看历史</td>
                </tr>
                <tr>
                    <td>昨日同期</td>
                    <td>0.00 s</td>
                    <td>0.00 s</td>
                    <td>0.00 s（0.00 %）</td>
                    <td>0.00 s</td>
                    <td>0.00 s（0.00 %）</td>
                    <td>0.00 s</td>
                     <td>查看历史</td>
                </tr>
                <tr>
                    <td>一周前同期</td>
                    <td>0.00 s</td>
                    <td>0.00 s</td>
                    <td>0.00 s（0.00 %）</td>
                    <td>0.00 s</td>
                    <td>0.00 s（0.00 %）</td>
                    <td>0.00 s</td>
                     <td>查看历史</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>            
</div>
</body>
</html>
<script>
$("#shouye").attr("class","active");
</script>