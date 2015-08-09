<%@page import="java.util.Enumeration"%>
<%@page import="java.util.Set"%>
<%@page contentType="text/html; charset=GBK" %>
<html>
	<head>	
	</head>
	<body>
		<%
			request.setCharacterEncoding("GBK");
			String method = request.getMethod();
			String ip = request.getRemoteAddr();
			String path = request.getServletPath();
			String context = request.getContextPath();
		 %>
		<center>
			<%=method %> <br>
			<%=ip %><br>
			<%=path %><br>
			<%=context %>
		</center>		
	</body>
</html>