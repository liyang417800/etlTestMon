<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<%
			session.setAttribute("name", "shishirui");
			session.setAttribute("email", "shishirui@youku.com");
		%>
		<% 
			String userName = (String)session.getAttribute("name");
			String userEmail = (String)session.getAttribute("email");
		%>
		<h2>姓名：<%=userName %></h2>
		<h2>邮箱：<%=userEmail %></h2>		
	</body>	
</html>
