<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<%
			application.setAttribute("name", "shishirui");
			application.setAttribute("email", "shishirui@youku.com");
		%>
		<a href="application_scope_02.jsp">通过会话属性传递</a>
	</body>	
</html>
