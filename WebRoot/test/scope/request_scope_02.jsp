<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<%
			request.setAttribute("name", "shishirui");
			request.setAttribute("email", "shishirui@youku.com");
		%>
		<jsp:forward page="request_scope_03.jsp"/>	
	</body>	
</html>
