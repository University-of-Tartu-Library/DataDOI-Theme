Various Exmaples:

http://localhost:8080/solr/statistics/select?indent=on&rows=0&facet=true&facet.field=statistics_type&q=isBot:false

http://localhost:8080/solr/statistics/select?q=type:2&sort=id+asc&fl=id&wt=xml&indent=true&facet=true&facet.pivot=owningColl,id&omitHeader=true&f.id.facet.limit=5

http://localhost:8080/solr/statistics/select?indent=on&rows=0&facet=true&facet.date=time&facet.date.start=2017-01-01T00:00:00Z&facet.date.end=2017-04-01T00:00:00Z&facet.date.gap=%2B1MONTH&q=type:0+AND+isBot:false


# Dspace constants

    /** Type of bitstream objects */
    public static final int BITSTREAM = 0;

    /** Type of bundle objects */
    public static final int BUNDLE = 1;

    /** Type of item objects */
    public static final int ITEM = 2;

    /** Type of collection objects */
    public static final int COLLECTION = 3;

    /** Type of community objects */
    public static final int COMMUNITY = 4;

    /** DSpace site type */
    public static final int SITE = 5;

    /** Type of eperson groups */
    public static final int GROUP = 6;

    /** Type of individual eperson objects */
    public static final int EPERSON = 7;



# top 5 views! 
http://localhost:8080/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fl=uid+score+&df=id&indent=true&facet=true&facet.field=id&omitHeader=true&f.id.facet.limit=5

# Last 7 days item views
http://localhost:8080/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fq=time:[NOW-7DAY%20TO%20NOW]

# to 5 views from last 7 days !!!!
http://localhost:8080/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fq=time:[NOW-7DAY%20TO%20NOW]&fl=uid+score+&df=id&indent=true&facet=true&facet.field=id&omitHeader=true&f.id.facet.limit=5

# all things!
http://localhost:8080/solr/search/select?&start=0&rows=4&q=search.resourcetype:2

# handle only 
http://localhost:8080/solr/search/select?&start=0&rows=4&q=search.resourcetype:2&fl=handle

# handle of an item with specific id
http://localhost:8080/solr/search/select?q=search.resourcetype:2+AND+search.resourceid:5d46ad1d-171d-4af8-8b09-480e2df405d3&fl=handle&omitHeader=true





Ref. http://www.moreofless.co.uk/static-content-web-pages-images-tomcat-outside-war/


Modify the following file: tomcat/conf/server.xml

      <Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">

       <Context docBase="/var/cache/tomcat" path="/static" />  <!-- added part -->


Make sure that /var/cache/tomcat and all files inside belong to tomcat

The content will be accessible from /static/file.txt for file.txt in  /var/cache/tomcat/file.txt




