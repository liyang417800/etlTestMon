<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<% 
			String userName = (String)request.getAttribute("name");
			String userEmail = (String)request.getAttribute("email");
		%>
		<h2>姓名：<%=userName %></h2>
		<h2>邮箱：<%=userEmail %></h2>
	</body>	
</html>
