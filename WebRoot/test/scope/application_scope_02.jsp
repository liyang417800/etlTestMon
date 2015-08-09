<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<% 
			String userName = (String)application.getAttribute("name");
			String userEmail = (String)application.getAttribute("email");
		%>
		<h2>姓名：<%=userName %></h2>
		<h2>邮箱：<%=userEmail %></h2>
	</body>	
</html>
