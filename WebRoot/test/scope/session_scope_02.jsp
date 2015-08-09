<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<%
			session.setAttribute("name", "shishirui");
			session.setAttribute("email", "shishirui@youku.com");
		%>
		<a href="session_scope_03.jsp">通过会话属性传递</a>
	</body>	
</html>
