<%@ page contentType="text/html; charset=GBK" %>
<html>
	<body>
		2秒后文件跳转，如果没有跳转请点击<a href="response_test.html">这里</a>！
		<%
			response.setHeader("refresh","2;response_test.html");
		 %>
	</body>
</html>