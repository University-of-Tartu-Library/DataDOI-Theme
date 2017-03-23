// *******************************************************
// *********** SHOW MORE/SHOW LESS ***********************
// *******************************************************
$(document).ready(function() {
	$(".morelink").click(function(){
		$(this).parent().toggle();         //self
		$(this).parent().prev().toggle();  //text
		$(this).parent().next().toggle();  //less
		return false;
	});
	$(".lesslink").click(function(){
		$(this).parent().toggle();                //self
		$(this).parent().prev().toggle();         //more
		$(this).parent().prev().prev().toggle();  //text
		return false;
	});
});


// *******************************************************
// *********** CITATION GENERATION ***********************
// *******************************************************


//bibtex citation generator
function toBibTex(dcArray, handle){
	var i, dcData;
	//replace forward slashes just in case
	var citation = "<pre>\n@misc{" + handle.replace("/", "_") + ",\n";

	var authors = [];
	var notes = [];

	for (i=0; i < dcArray.length; ++i) {
		dcData = dcArray[i];
		switch(dcData.key) {
			case "dc.contributor.author":
				authors.push(dcData.value);
				break;
			case "dc.title":
				citation += '    title = {' + dcData.value + '},\n';
				break;
			case "dc.date.issued":
				var day = moment(dcData.value);
				var year = day.year();
				if (year) {
					//not failed to parse the date
					citation += '    year = {' + year + '},\n';
				}
				break;
			case "dc.identifier.uri":
				notes.push(dcData.value);
				break;
			case "dc.relation":
				citation += '    relation = {' + dcData.value + '},\n';
				break;
		}
	}

	if (authors) {
		citation += '    author = {' + authors.join(' and ') + '},\n';
	}
	if (notes) {
		citation += '    note = {' + notes.join('; ') + '},\n';
	}

	//final }
	citation += '}\n<\pre>';

	return citation;
}


// display bibtex
function displayBibTex(){
	//URL of dspace rest server
	var REST_SERVER = "/rest";
	var path = window.location.pathname;
	// if xmlui is present in path
	var handle = path.replace("/xmlui", "");
	function ajaxError() {
		$("#bibtex_content").text("Failed to produce bibtex");
	}
	$.ajax(REST_SERVER + handle,
		{
			success: function(handleData) {
				if (handleData.hasOwnProperty('link')) {
					var metadataLink = handleData.link + '/metadata';
					$.ajax(metadataLink,
						{
							success: function(linkData){
								var bibtex = toBibTex(linkData, handle);
								console.log(bibtex);
								$("#bibtex_content").html(bibtex);
							},
							error: ajaxError
						});

				}
			},
			error: ajaxError
		});
}

//display bibtexModal
$("#bibtexModal").on("show.bs.modal", displayBibTex);




// *******************************************************
// ***********   EASY SUBMISSION   ***********************
// *******************************************************

function treeToMenu(tree) {
	if ("value" in tree) {
		// leaf object
		if (tree.value) {
			return "<div class='leaf'><a href='" + tree.value + "'>" + tree.name + "</a></div>";
		} else {
			return "";
		}
	} else {
		var leafs = "<div class='leafs'>"
		var keys = Object.keys(tree);
		var key;
		for (var i=0; i < keys.length; i++) {
			key = keys[i];
			if ((key !== "name") && (key !== "value")) {
				leafs += treeToMenu(tree[key]);
			}
		}
		return leafs + "</div>"
	}
}

if ($("#aspect_submission_submit_SelectCollectionStep_field_handle > option").length > 0) {
	var institutes_collections = {};
	var i, dict, lvl;
	$("#aspect_submission_submit_SelectCollectionStep_field_handle > option").each(function(){
		var levels = this.text.split(' > ');
		var value = this.value;
		// depending on the leve, the dictionary will change
		dict = institutes_collections;
		for (i = 0; i < levels.length; i++) {
			lvl = levels[i];
			// if lvl is not present in dictionary create it
			if (!(lvl in dict)) {
				dict[lvl] = {};
				dict[lvl]["name"] = lvl;
				// if object is last in hierarchy, record link value
				if (i == levels.length - 1) {
					dict[lvl]["value"] = value;
				}			
			}
			// update the data structure lvl
			dict = dict[lvl];
		}
	});
	console.log(institutes_collections);

	//console.log(treeToMenu(institutes_collections));

	$("#aspect_submission_submit_SelectCollectionStep_field_handle").next().html(treeToMenu(institutes_collections));
;}