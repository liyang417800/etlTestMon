<%@page contentType="text/html" pageEncoding="utf-8" %>
<html>
	<body>
		<%
			pageContext.setAttribute("name", "shishirui");
			pageContext.setAttribute("email", "shishirui@youku.com");
		%>
		<jsp:forward page="page_scope_03.jsp"/>	
	</body>	
</html>
