// *******************************************************
// *********** SHOW MORE/SHOW LESS ***********************
// *******************************************************
$(document).ready(function () {
	$(".morelink").click(function () {
		$(this).parent().toggle();         //self
		$(this).parent().prev().toggle();  //text
		$(this).parent().next().toggle();  //less
		return false;
	});
	$(".lesslink").click(function () {
		$(this).parent().toggle();                //self
		$(this).parent().prev().toggle();         //more
		$(this).parent().prev().prev().toggle();  //text
		return false;
	});
});


// *******************************************************
// *********** CITATION GENERATION ***********************
// *******************************************************

//save to disk
function createDownloadText(filename, data) {
	var blob = new Blob([data], { type: 'text/plain' });
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(blob, filename);
	}
	else {
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}

//endnote citation generator
function toEndNote(dcArray) {

	var citation = "TY  - GEN\n";

	for (i = 0; i < dcArray.length; ++i) {
		dcData = dcArray[i];
		switch (dcData.key) {
			case "dc.contributor.author":
				citation += 'AU  - ' + dcData.value + '\n';
				break;
			case "dc.title":
				citation += 'TI  - ' + dcData.value + '\n';
				break;
			case "dc.date.issued":
				var day = moment(dcData.value);
				var year = day.year();
				if (year) {
					//not failed to parse the date
					citation += 'PY  - ' + year + '\n';
				}
				break;
			case "dc.subject":
				citation += 'KW  - ' + dcData.value + '\n';
				break;
			case "dc.identifier.uri":
				citation += 'LK  - ' + dcData.value + '\n';
				break;
			case "dc.relation":
				citation += 'L3  - ' + dcData.value + '\n';
				break;
		}
	}

	//final }
	citation += 'ER  - \n';

	return citation;
}


//bibtex citation generator
function toBibTex(dcArray, handle) {
	var i, dcData;
	//replace forward slashes just in case
	var citation = "<pre>\n@misc{" + handle.replace("/", "_") + ",\n";

	var authors = [];
	var notes = [];

	for (i = 0; i < dcArray.length; ++i) {
		dcData = dcArray[i];
		switch (dcData.key) {
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
function displayBibTex() {
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
			success: function (handleData) {
				if (handleData.hasOwnProperty('link')) {
					var metadataLink = handleData.link + '/metadata';
					$.ajax(metadataLink,
						{
							success: function (linkData) {
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

// display bibtex
function downloadEndNote() {
	//URL of dspace rest server
	var REST_SERVER = "/rest";
	var path = window.location.pathname;
	// if xmlui is present in path
	var handle = path.replace("/xmlui", "");
	function ajaxError() {
		alert("Failed to connect to server");
	}
	$.ajax(REST_SERVER + handle,
		{
			success: function (handleData) {
				if (handleData.hasOwnProperty('link')) {
					var metadataLink = handleData.link + '/metadata';
					$.ajax(metadataLink,
						{
							success: function (linkData) {
								var endnote = toEndNote(linkData);
								console.log(endnote);
								createDownloadText("citation" + handle.replace("/", "_") + ".ris", endnote)
							},
							error: ajaxError
						});

				}
			},
			error: ajaxError
		});
}

//display/download citations
$("#bibtexModal").on("show.bs.modal", displayBibTex);
$("#endnoteCitation").on("click", downloadEndNote);


// *******************************************************
// ****   PRETTY COLLECTION SELECTION FOR SUBMISSION   ***
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
		for (var i = 0; i < keys.length; i++) {
			key = keys[i];
			if ((key !== "name") && (key !== "value")) {
				leafs += treeToMenu(tree[key]);
			}
		}
		return leafs + "</div>"
	}
}

var submit_col_selector = $("#aspect_submission_submit_SelectCollectionStep_field_handle")
if (submit_col_selector.length > 0) {
	var optgroup = null;
	var option_html;
	submit_col_selector.children("option").each(function () {
		//if this is a regular option, place into group...
		if (this.value) {

			option_html = "";
			// First level community defines optgroup
			var levels = this.text.split(' > ');
			console.log(this.text);
			var cur_group = levels[0];
			var rest = levels.slice(1).join(' > ');
			console.log(cur_group);
			console.log(rest);

			if (!optgroup || cur_group !== optgroup.attr("label")) {
				$(this).parent().append(optgroup);
				//new optgroup
				optgroup = $("<optgroup label='" + cur_group + "'></optgroup>");
			}

			// generate option
			option_html = "<option value='" + this.value + "'>" + rest + "</option>";
			optgroup.append(option_html);

			//and delete option
			$(this).remove()
		}
	});

	// add last optgroup
	submit_col_selector.append(optgroup);

	// and prettify
	submit_col_selector.select2();

	// in addition, add video using embedding code from youtube
	var $form = $("#aspect_submission_submit_SelectCollectionStep_div_select-collection")
	$form.append("<p class='help-block'>Andmete üleslaadimise juhend (in estonian):</p>")
	var video_embed = '<iframe width="560" height="315" src="https://www.youtube.com/embed/AzQ_Lca1KPg?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
	var embedded_div = $("<div>").html(video_embed).css('text-align', 'center');
	$form.append(embedded_div);

}



// *******************************************************
// ****   modify input forms    ***
// *******************************************************

//Make keyword field small
$("#aspect_submission_StepTransformer_field_dc_subject").parent().attr("class", "col-xs-3");

// disable add abstract button after the first click
// $("button").find("[name=submit_dc_description_abstract_add]").on("click", function(e) {
// 	$(this).prop("disabled", true);
// })
// change add keywords width
// var abstract = $("label[for='aspect_submission_StepTransformer_field_dc_description_abstract']");
// if (abstract.length > 0) {
// 	if (abstract.parent().find)
// }
