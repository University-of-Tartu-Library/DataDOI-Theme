<!--

    The contents of this file are subject to the license and copyright
    detailed in the LICENSE and NOTICE files at the root of the source
    tree and available online at

    http://www.dspace.org/license/

-->

<!--
    @max : various small modifications

-->

<xsl:stylesheet
        xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
        xmlns:dri="http://di.tamu.edu/DRI/1.0/"
        xmlns:mets="http://www.loc.gov/METS/"
        xmlns:dim="http://www.dspace.org/xmlns/dspace/dim"
        xmlns:xlink="http://www.w3.org/TR/xlink/"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
        xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:ore="http://www.openarchives.org/ore/terms/"
        xmlns:oreatom="http://www.openarchives.org/ore/atom/"
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:xalan="http://xml.apache.org/xalan"
        xmlns:encoder="xalan://java.net.URLEncoder"
        xmlns:util="org.dspace.app.xmlui.utils.XSLUtils"
        xmlns:confman="org.dspace.core.ConfigurationManager"
        exclude-result-prefixes="xalan encoder i18n dri mets dim xlink xsl util confman">

    <xsl:output indent="yes"/>

    <!-- Match all community log divs -->
    <xsl:template match="dri:div[@id='aspect.artifactbrowser.CommunityBrowser.div.comunity-browser']//dri:div[@rend='homepage-community-logo']">
        <!-- <h2><xsl:value-of select="." /></h2> -->
        <xsl:variable name="dim" select="."/>
        <xsl:variable name="hlink" select="dri:xref/@target"/>
        <!-- <xmp><xsl:copy-of select="dri:xref/@target"/></xmp> -->
        <a href="{$hlink}" class="link-image-wrapper">
            <img class="img-responsive homepage-community-logo center-block" src="{$theme-path}images/{$dim}.jpg" />
            <div class="community-borwser-link-wrapper">
                <span>
                    <xsl:value-of select="node()"/>
                </span>
            </div>
        </a>
    </xsl:template>

    <!-- Delete community browser paragraph message -->
    <xsl:template match="dri:div[@id='aspect.artifactbrowser.CommunityBrowser.div.comunity-browser']/dri:p">
    </xsl:template>


    <!-- Add statistics to front page -->
    <xsl:template match="dri:div[@id='aspect.discovery.SiteRecentSubmissions.div.site-home']">
        <div class="row">
            <div class="homepage-discovery-column recent-submissions-column col-sm-12  col-md-6">
                <xsl:apply-templates/>
            </div>
            <div class="homepage-discovery-column most-viewed-column col-sm-12  col-md-6">
                <h2 class="ds-div-head page-header">Most viewed</h2>
                <div>
                    <xsl:apply-templates select="document('http://localhost:8080/static/pops.xml')/dri:document/dri:referenceSet" />
                </div>
            </div>
        </div>
    </xsl:template>

<!-- Customiza front page discovery. Abondoned.
    <xsl:template match="dri:div[@id='aspect.discovery.SiteRecentSubmissions.div.site-home']">
        <div class="row">
            <div class="homepage-discovery-column recent-submissions-column col-sm-12  col-md-6">
                <xsl:apply-templates/>
            </div>
            <div class="homepage-discovery-column most-viewed-column col-sm-12  col-md-6">
                <h2 class="ds-div-head page-header">Most viewed</h2>
                <div>
                    <xsl:apply-templates select="document('http://localhost:8080/solr/statistics/select?q=type:2&amp;fq=statistics_type:view&amp;fq=-isBot:true&amp;fl=uid+score+&amp;df=id&amp;indent=true&amp;facet=true&amp;facet.field=id&amp;omitHeader=true&amp;f.id.facet.limit=5')/response/lst[@name='facet_counts']/lst[@name='facet_fields']" mode="popular-items-solr"/>
                </div>
            </div>
            <div class="summary-statistics-column col-sm-12 col-md-12" id="summary-statistics">
                <h2 class="ds-div-head page-header">Usage statistics</h2>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="" mode="popular-items-solr">
        <xsl:for-each select="(lst[@name='id'])[5 &lt;= position()]">
            <xsl:value-of select="@name"/> sdafs 
        </xsl:for-each>
    </xsl:template>

    <xsl:template match="/response/*[not(self::lst[@name='facet_counts'])]" mode="remove-rest"></xsl:template>
 -->

</xsl:stylesheet>
