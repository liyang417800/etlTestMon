<%@page import="java.util.Set"%>
<%@page contentType="text/html; charset=GBK" %>
<html>
	<head>	
	</head>
	<body>
		<%
			request.setCharacterEncoding("GBK");
			String name = request.getParameter("name");
		 %>
		<%=name %>
	</body>
</html>