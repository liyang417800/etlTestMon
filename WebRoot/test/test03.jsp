<%@page contentType="text/html" pageEncoding="GBK" %>
<html>
	<body>
		<%int i = 1; %>
		<h1>include.jsp--<%=i%></h1>
		<jsp:include page="include01.jsp"/>
		<jsp:include page="include02.jsp">
			<jsp:param name="name" value="master"/>
			<jsp:param name="email" value="shishirui@gmail.com"/>
		</jsp:include>		
	</body>
</html>