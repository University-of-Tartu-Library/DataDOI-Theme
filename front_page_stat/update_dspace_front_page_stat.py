#!/usr/bin/env python2
import requests
import sys
from xml.etree import ElementTree as ET

statistics_file_location = "/var/cache/tomcat/pops.xml"
solr_query_string = "http://localhost:80/solr/statistics/select?q=type:2&fq=statistics_type:view&fq=-isBot:true&fq=time:[NOW-7DAY%20TO%20NOW]&fl=uid+score+&df=id&indent=true&facet=true&facet.field=id&omitHeader=true&f.id.facet.limit=50"

# try getting last 7 days most accessed items
try:
	resp = requests.get(solr_query_string)
except requests.exceptions.RequestException as e:  # This is the correct syntax
    print(e)
    sys.exit(1)


def uid_to_handle(uid):
	""" query solr to get item handle"""
	query  = "http://localhost:80/solr/search/select?q=search.resourcetype:2+AND+search.resourceid:{}&fl=handle&omitHeader=true&json=true"
	resp = requests.get(query.format(uid))
	tree = ET.fromstring(resp.content)
	try:
		return tree.find(".//str").text
	except AttributeError:
                print('Couldnt find corresponding handle for uid={}!'.format(uid))
		#print(ET.dump(tree))
                return None
		

# parse tree and find relevant items
tree = ET.fromstring(resp.content)

popular_items = []  # contains handles and number of views
for item in tree.iter("int"):
	uid = item.get("name")
        handle = uid_to_handle(uid)
	accessed = item.text
        if handle:
            print('{} corresponds to {}'.format(uid, handle))
            popular_items.append((handle, accessed))
        if len(popular_items) > 4:
            #print('Found enough popular items!')
            break

# build a new tree for uploading
root = ET.Element("document")
# set namespace
root.attrib["xmlns"] = "http://di.tamu.edu/DRI/1.0/"

# define elment type, id, etc
refset = ET.SubElement(root, "referenceSet")
refset.attrib["id"]  = "aspect.artifactbrowser.CommunityBrowser.referenceSet.community-browser"
refset.attrib["type"]  = "summaryList"
refset.attrib["rend"]  = "hierarchy"
refset.attrib["n"]  = "community-browser"


# add elements
for handle, accesses in popular_items:
	mets_str = "/metadata/handle/{}/mets.xml"
	ref = ET.SubElement(refset, "reference")
	ref.attrib["repositoryID"] = handle.split("/")[0]
	ref.attrib["url"] = mets_str.format(handle)
	ref.attrib["type"] = "Dspace Item"
	ref.attrib["views"] = accesses

# write tree
with open(statistics_file_location, 'w') as f:
	f.write(ET.tostring(root, encoding="utf-8"))

