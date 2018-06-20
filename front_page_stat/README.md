# Dspace statisics generation

Run the python script with crontab to create a file with dspace views statistics.

## Setting up tomcat for serving static files

This python script creates a file with the most viewed items that can be served by any web server. If you want to serve it with you will need to (Ref. http://www.moreofless.co.uk/static-content-web-pages-images-tomcat-outside-war):


1. Add the following row to `tomcat/conf/server.xml`

      <Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">

      <Context docBase="/var/cache/tomcat" path="/static" />  <!-- added part -->

2. Make sure that /var/cache/tomcat and all files inside are owned by tomcat user
3. The file placed into `/var/cache/tomcat/file.txt` will be accessible via `/static/file.txt`







## Various Exmaples of dspace Solr:

**top 5 views**
http://localhost:8080/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fl=uid+score+&df=id&indent=true&facet=true&facet.field=id&omitHeader=true&f.id.facet.limit=5

**Last 7 days item views**
http://localhost:8080/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fq=time:[NOW-7DAY%20TO%20NOW]

**Top 5 views from last 7 days**
http://localhost:8080/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fq=time:[NOW-7DAY%20TO%20NOW]&fl=uid+score+&df=id&indent=true&facet=true&facet.field=id&omitHeader=true&f.id.facet.limit=5

**all items**
http://localhost:8080/solr/search/select?&start=0&rows=4&q=search.resourcetype:2

**display handle only**
http://localhost:8080/solr/search/select?&start=0&rows=4&q=search.resourcetype:2&fl=handle

**handle of an item with a specific id**
http://localhost:8080/solr/search/select?q=search.resourcetype:2+AND+search.resourceid:5d46ad1d-171d-4af8-8b09-480e2df405d3&fl=handle&omitHeader=true






