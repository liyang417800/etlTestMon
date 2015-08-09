<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<% 
			String userName = (String)pageContext.getAttribute("name");
			String userEmail = (String)pageContext.getAttribute("email");
		%>
		<h2>姓名：<%=userName %></h2>
		<h2>邮箱：<%=userEmail %></h2>
	</body>	
</html>
