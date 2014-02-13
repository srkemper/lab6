'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.project a').click(addProjectDetails);

	$('#colorBtn').click(randomizeColors);
}

/*
 * Make an AJAX call to retrieve project details and add it in
 */
function addProjectDetails(e) {
	// Prevent following the link
	e.preventDefault();

	// Get the div ID, e.g., "project3"
	var projectID = $(this).closest('.project').attr('id');
	// get rid of 'project' from the front of the id 'project3'
	var idNumber = projectID.substr('project'.length);

	console.log("User clicked on project " + idNumber);
	var url = "/project/" + idNumber;
	console.log(url);
	$.get(url, addProject);
}

function addProject(result) {
	console.log(result);
	var selector = "#project" + result['id'] + " .details";

	var details = '<img src="' + result['image'] + '"class="img detailsImage">' + '<h3>' + result['date'] + '</h3>' + result['summary'];

	var url = 'http://ws.spotify.com/search/1/track.json?q=';
	result['title'].split(" ").forEach(function(word) {
		url += word;
		url += "+";
	});
	url = url.substr(0, url.length - 1); //remove the last + at the end
	console.log(url);

	$.get(url, function(songs) {
		console.log(songs);
		if (songs['tracks'].length > 0) {
			details += "<h4>Spotify's Top 10 Songs for " + result['title'] + "</h4>";
			details += "<ol>";
			for(var i = 0; i < 10; i++) {
				details += "<li><b>" + songs['tracks'][i]['name'] + "</b> by " + songs['tracks'][i]['artists'][0]['name'] + " - " + songs['tracks'][i]['album']['released'] + " </li>";
			}
			details += "</ol>";
		}
		else {
			details += "<h4> No Tracks Found for " + result['title'] + "</h4>";
		}
		var artistsURL = 'http://ws.spotify.com/search/1/artist.json?q=';
		result['title'].split(" ").forEach(function(word) {
			artistsURL += word;
			artistsURL += "+";
		});
		artistsURL = artistsURL.substr(0, artistsURL.length - 1); //remove the last + at the end
		$.get(artistsURL, function(artists) {
			console.log(artists);
			if (artists['artists'].length > 0) {
				details += "<h4>Spotify's Top 10 Artists for " + result['title'] + "</h4>";
				details += "<ol>";
				var size = 10;
				if (songs['artists'].length < 10) {
					size = songs['artists'].length;
				}
				for(var i = 0; i < size; i++) {
					details += "<li>" + songs['artists'][i]['name'] + " </li>";
				}
				details += "</ol>";
			}
			else {
				console.log('else');
				details += "<h4> No Artists Found for " + result['title'] + "</h4>";
				console.log(details);
			}
			$(selector).html(details);
		});

	});

}

/*
 * Make an AJAX call to retrieve a color palette for the site
 * and apply it
 */
function randomizeColors(e) {
	console.log("User clicked on color button");
	$.get('/palette', getRandomColor);
}

function getRandomColor(result) {
	var colors = result['colors']['hex'];
	console.log(colors);
	$('body').css('background-color', colors[0]);
	$('.thumbnail').css('background-color', colors[1]);
	$('h1, h2, h3, h4, h5, h5').css('color', colors[2]);
	$('p').css('color', colors[3]);
	$('.project img').css('opacity', .75);
}