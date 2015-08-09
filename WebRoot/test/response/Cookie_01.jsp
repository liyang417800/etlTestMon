<%@ page contentType="text/html; charset=GBK" %>
<html>
	<body>
		<%
			Cookie c1 = new Cookie("xm","ssr");
			Cookie c2 = new Cookie("email","shishirui@youku.com");
			c1.setMaxAge(60);
			c2.setMaxAge(60);
			response.addCookie(c1);
			response.addCookie(c2);
		 %>
	</body>
</html>