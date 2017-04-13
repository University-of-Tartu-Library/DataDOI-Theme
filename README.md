# University of Tartu Mirage 2 theme


**Citation**

In case citations are not being generated due to CORS problems you should add the following filter to your tomcat web.xml settings ([tomcat]/conf/web.xml):


```xml
 <filter>
     <filter-name>CorsFilter</filter-name>
     <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
     <init-param>
         <param-name>cors.allowed.origins</param-name>
         <param-value>http://datadoi.ut.ee</param-value>
     </init-param>
     <init-param>
       <param-name>cors.allowed.methods</param-name>
       <param-value>GET,POST,HEAD,OPTIONS,PUT</param-value>
     </init-param>
 </filter>
 <filter-mapping>
   <filter-name>CorsFilter</filter-name>
   <url-pattern>/*</url-pattern>
 </filter-mapping>
```



