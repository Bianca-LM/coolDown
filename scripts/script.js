$(document).ready( function(){
	addCss()

	$.ajax({
		method: "GET", 
		url: "https://raw.githubusercontent.com/Bianca-LM/Information-modelling/main/articlelist.json",
		success: function(data) {
			$.each(JSON.parse(data), function(i, obj) {
				if (obj.label === "Intro") {
					var brand = document.getElementById("brand");
					var url = String(obj.url);
					brand.setAttribute("onclick", "load(\"" + url + "\")");
				}
				else {
					var url = String(obj.url);
					var label = obj.label;
					var listItem = "<li><button class='articles' onclick='load(\"" + url + "\")'>" + label + "</button></li>";
					var linkItem = "<a class='dropdown-item' onclick='load(\"" + url + "\")'>" + label + "</a>"

					$('#articleslist').append(listItem);
					$('#dropdownMenu').append(linkItem);
				}
			})
		},
		error: function(data) {
			alert('This document does not exist');
		}
	});

	//see if there are articles waiting to be loaded
	if (sessionStorage.getItem("article") != null) {
		
		var data = sessionStorage.getItem("article")
		newArticle = $('#article').html(data);
		$('#article').replaceWith(newArticle);
		addInfo();
		addFromLocalStorage();
		addMetadata();
		sessionStorage.removeItem("article");
	}

	$('#show-keywords').click(function() {
		if (this.checked) {
			$('span.added-keywords').addClass('keywords-background');
		}
		else {
			$('span.added-keywords').removeClass('keywords-background');
		}
	});

	$('#show-people').click(function() {
		if (this.checked) {
			$('span.person').addClass('people-background');
		}
		else {
			$('span.person').removeClass('people-background');
		}
	});
	
	$('#show-organizations').click(function() {
		if (this.checked) {
			$('span.organization').addClass('organizations-background');
		}
		else {
			$('span.organization').removeClass('organizations-background');
		}
	});
	
	$('#show-places').click(function() {
		if (this.checked) {
			$('span.place').addClass('places-background');
		}
		else {
			$('span.place').removeClass('places-background');
		}
	});
	$('#show-events').click(function() {
		if (this.checked) {
			$('span.event').addClass('events-background');
		}
		else {
			$('span.event').removeClass('events-background');
		}
	});
	$('#show-references').click(function() {
		if (this.checked) {
			$('span.reference').addClass('references-background');
		}
		else {
			$('span.reference').removeClass('references-background');
		}
	});
})

//keep the same CSS while changing html page
function addCss() {
	var css = document.getElementById("CSS");
	if (sessionStorage.getItem("theme")==null) {
		css.setAttribute("href", "styles/style.css");
	}
	else {
		var theme = sessionStorage.getItem("theme");
		if (css.hasAttribute("href")){
			css.removeAttribute("href");
		}
		css.setAttribute("href", theme);
	}
}

function load(url) {
	$.ajax({
		url: url, 
		method: 'GET',
		dataType: "html",
		success: function(data) {
			if (window.location.pathname.includes("documentation.html") || window.location.pathname.includes("about.html")) {
				sessionStorage.setItem("article", data);
				window.location.href = "https://bianca-lm.github.io/coolDown/";
			}
			else {
				newArticle = $('#article').html(data);
				$('#article').replaceWith(newArticle);
				addInfo();
				addFromLocalStorage();
				addMetadata();
			}
		},
		error: function(data) {
			alert('Loading error');
		}
	});
}

function addInfo() {
	var article = document.getElementById("article");
	var ul = document.createElement("ul");
	var info = document.getElementById("info");
	info.innerHTML="";
	info.appendChild(ul);
	var title = article.getElementsByTagName("title");
	for (var i=0; i < title.length; i++) {
		var titleLi = document.createElement("li");
		titleLi.setAttribute("id", "title");
		titleLi.innerText = title[i].innerHTML;
		ul.appendChild(titleLi);
		article.removeChild(title[i]);
	}

	var author = article.getElementsByClassName("author");
	for (var i=0; i < author.length; i++) {
		var authorLi = document.createElement("li");
		authorLi.innerHTML = author[i].innerHTML;
		ul.appendChild(authorLi);
	}
	var citeAs = article.getElementsByClassName("citeAs");
	for (var i=0; i < citeAs.length; i++) {
		var citeAsLi = document.createElement("li");
		citeAsLi.innerHTML = citeAs[i].innerHTML;
		ul.appendChild(citeAsLi);
	}
	var date = article.getElementsByClassName("date");
	for (var i=0; i < date.length; i++) {
		var dateLi = document.createElement("li");
		dateLi.innerHTML = date[i].innerHTML;
		ul.appendChild(dateLi);
	}

	var source = article.getElementsByClassName("originalSource");
	for (var i=0; i < source.length; i++) {
		var sourceLi = document.createElement("li");
		sourceLi.innerHTML = source[i].innerHTML;
		ul.appendChild(sourceLi);
	}
}

function addMetadata() {
	metadataLists("people", "person");
	metadataLists("organizations", "organization");
	metadataLists("places", "place");
	metadataLists("references", "reference");
	metadataLists("events", "event");
}

function metadataLists(type, occurrence) {
	var div = document.getElementById(type);
	var ul = div.getElementsByTagName("ul")[0];
	ul.innerHTML = "";
	var allOccurrences = document.getElementsByClassName(occurrence);

	for (var i = 0; i < allOccurrences.length; i++) {
		var li = document.createElement("li");
		var link = document.createElement("a");
		link.setAttribute("href", "#"+type+"-"+i.toString());
		link.innerHTML = allOccurrences[i].innerHTML;
		li.appendChild(link);
		allOccurrences[i].setAttribute("id", type+"-"+i.toString());
		ul.appendChild(li);
	}
}

function addNewKeyToLocalStorage(text, partialCount) {
	var title = document.getElementById("title");

	if (localStorage.getItem(JSON.stringify(title.innerHTML)) === null) {
		var emptyObject = new Object();
		emptyObject[text] = {count: partialCount};
		emptyObject["totalCount"] = partialCount;
		localStorage.setItem(JSON.stringify(title.innerHTML), JSON.stringify(emptyObject));
	}
	
	else {
		var titleContent = JSON.parse(localStorage.getItem(JSON.stringify(title.innerHTML)));
		if (titleContent[text] == null || titleContent[text] == undefined) {
			titleContent[text] = {count: partialCount};
			titleContent["totalCount"] += partialCount;
			localStorage.setItem(JSON.stringify(title.innerHTML), JSON.stringify(titleContent));
		}
	}
}

function addFromLocalStorage() {
	var title = document.getElementById("title");
	if (title != null) {
		var lS = JSON.parse(localStorage.getItem(JSON.stringify(title.innerHTML)));
		var box = document.getElementById("keywords");
		box.innerHTML = "";

		if (lS != null || lS != undefined) {
			var keys = Object.keys(lS);
			var idx = 0;
			for (var i = 0; i < keys.length; i++) {
				var keyword = keys[i];
				if (keyword == "totalCount") {
					continue
				}
				addMetadataToBox(keyword);
				matchInText(keyword);
				count = lS[keyword].count;
				for (var l=0; l < count; l++) {
					addSingleOccurrences(keyword, idx);
					idx+=1;
				}
			}
		}
	}
}

// code for the accordion
$(document).on("click", ".accordion", function() {
	if ($(this).hasClass("active")) {
		$(this).removeClass("active").next().slideUp();
	}
	else {
		$('.accordion.active').removeClass('active').next().slideUp();
		$(this).toggleClass("active");
		$(this).next().slideDown();
	}
})

$(document).on("click", ".label", function() {
	if ($(this).hasClass("active")) {
		$(this).removeClass("active").next().slideUp();
	}
	else {
		$('.label.active').removeClass('active').next().slideUp();
		$(this).toggleClass("active");
		$(this).next().slideDown();
	}
})


function changeStyleSheet(element) {
	var d = document.getElementById("CSS");
	d.removeAttribute("href");
	var nameOfTheStyle = element.id;
	 if (nameOfTheStyle == "year2022") {
		d.setAttribute("href", "styles/style.css");
		removeSpan();
		sessionStorage.setItem("theme", "styles/style.css");
 	}
 	if (nameOfTheStyle == "year1910") {
		d.setAttribute("href", "styles/style_1910.css");
		increaseFont();
		sessionStorage.setItem("theme", "styles/style_1910.css")
 	}
}

function eventListener(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		addNewMetadata();
	}
}

function addNewMetadata() {
    var input = document.getElementById("userInput").value;
    if (input != "") {
		var inputList = input.split(/(?=[ .:;?!~,-`"&|()<>{}\[\]\r\n\s/\\]+)/);
		findMatches(inputList);
		showOccurrences();
	}
}

function findMatches(inputList) {
	var article = document.getElementById("article");
	var articleChildren = article.childNodes;

	var matches = new Array();

	var punctuation = /(?=[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]|\s)/;
	var stringToMatch = "\\b";

	for (var i = 0; i < inputList.length; i++) {
		var oneWord = inputList[i];
		if (punctuation.test(oneWord)) {
			stringToMatch = stringToMatch + oneWord + "?";
		}
		else
		{	
			if (/.s\b|.d\b/.test(oneWord.substring(oneWord-1))) {

				let substring = oneWord.substring(0, oneWord.length-1);
				var desinences = "(...es|ed|d|ing|ied|ies|s)";
				stringToMatch = stringToMatch + substring + "{0,2}" + desinences + "?" ;
			}

			else if (/.ing|.ied|.ies/.test(oneWord.substring(oneWord-3))) {

				let substring = oneWord.substring(0, oneWord.length-3);
				var desinences = "(...es|ed|d|ing|ied|ies|s|e|y|\b)";
				stringToMatch = stringToMatch + substring + "?" + desinences;
			}

			else {
				var desinences = "(...es|ed|d|ing|ied|ies|s)";
				stringToMatch = stringToMatch + oneWord + "?" + desinences + "?" ;
			}
		}
	}


	stringToMatch += "\\b";
	var flag = "gi";
	var regex = new RegExp(stringToMatch, flag);
	
	for (var i = 0; i < articleChildren.length; i++) {
		if (articleChildren[i].nodeName != "FIGURE"  && articleChildren[i].nodeName != "#text" && articleChildren[i].nodeName != "#comment") {

				var textToCheck = articleChildren[i].innerHTML;
				textToCheck = textToCheck.replaceAll(/id="[a-zA-Z0-9-\s]*"/g, "");
				textToCheck = textToCheck.replaceAll(/class="[a-zA-Z0-9-\s]*"/g, "");
				var partMatches = textToCheck.match(regex);
			
				Array.prototype.push.apply(matches, partMatches);
			}
	}
	var uniqueMatches = [... new Set(matches)];
	addToKeywordsBox(uniqueMatches);
}

function addToKeywordsBox(uniqueMatches) {
	var title = document.getElementById("title");

	if (!uniqueMatches.length == 0) {
		var lS = JSON.parse(localStorage.getItem(JSON.stringify(title.innerHTML)));

		if (lS == null) { 
			id = 0;
		}
		else {
			id = lS["totalCount"];
		}

		for (var i = 0; i < uniqueMatches.length; i++) {
			
			addMetadataToBox(uniqueMatches[i]);
			matchInText(uniqueMatches[i]);

			var regex = new RegExp("-"+uniqueMatches[i]);
			var count = document.getElementById("numOfOccurrences-"+uniqueMatches[i]).innerHTML.replace(regex, "");
			addNewKeyToLocalStorage(uniqueMatches[i], Number(count));
			var label = document.getElementById(uniqueMatches[i]+"-key");
			var content = label.nextElementSibling;
			var keywordLink = content.getElementsByTagName("a");
			if (keywordLink.length == 0 && count != 0) {
				for (var l = 0; l < Number(count); l++) {
					addSingleOccurrences(uniqueMatches[i], id);
					id += 1;
				}
			}
		}
	}
	else {
		alert("No matches found");
	}
}


function matchInText(text) {
	var article = document.getElementById("article");
	var articleChildren = article.childNodes;

	var count = 0;
	
	var exactRegex = RegExp("(?<!>)\\b"+text+"\\b", "g");
	var newString = "<span class=\"added-keywords\" id=\"keyword\">" + text + "</span>";
	for (let i = 0; i < articleChildren.length; i++) {
		if (articleChildren[i].nodeName != "FIGURE"  && articleChildren[i].nodeName != "#text" && articleChildren[i].nodeName != "#comment") {
			var textToCheck = articleChildren[i].innerHTML;
			textToCheck = textToCheck.replaceAll(/id="[a-zA-Z0-9-\s]*"/g, "");
			textToCheck = textToCheck.replaceAll(/class="[a-zA-Z0-9-\s]*"/g, "");
			if (textToCheck.match(exactRegex) != null) {
				var partialCount = textToCheck.match(exactRegex).length;
				count += partialCount;
				articleChildren[i].innerHTML = textToCheck.replaceAll(exactRegex, newString);
			}
		}
	}

	var numberOfOccurrences = document.getElementById("numOfOccurrences-"+text);
	if (count != 0 || count == 0 && numberOfOccurrences.innerText == "") {
		numberOfOccurrences.appendChild(document.createTextNode(count));
	}
}

function addMetadataToBox(text){
	
	var box = document.getElementById("keywords");
	var children = box.getElementsByClassName("label");
	var keyId = text.replace(/\s/g, "");
	var idx = 0;
	if (children != null) {
		for (var i=0; i<children.length; i++) {
			var checkId = children[i].getAttribute("id");
			checkId = checkId.replace(/\s/g, "");
			if (keyId+"-key" == checkId) {
				idx += 1;
			}
		}
	}

	//no labels found, create a new label for the keyword
	if (idx == 0) { 
		var label = document.createElement("div");
		label.setAttribute("class", "label");
		label.setAttribute("id", keyId+"-key");
		box.appendChild(label);
		label.appendChild(document.createTextNode(text+" "));
		var numberOfOccurrences = document.createElement("span");
		numberOfOccurrences.setAttribute("id", "numOfOccurrences-"+keyId);
		label.appendChild(numberOfOccurrences);
		var content = document.createElement("div");
		content.setAttribute("class", "hidden content");
		box.appendChild(content);
		var list = document.createElement("ol");
		content.appendChild(list);
	}
	
}


function addSingleOccurrences(singleMatch, id) {
	var d = document.getElementById("keyword");
	if (d != null) {
		d.removeAttribute("id");
		var uniqueId = singleMatch+"-"+id;
		d.setAttribute("id", uniqueId);
	}

	var labelBoxes = document.getElementsByClassName("label");

	for (var i = 0; i < labelBoxes.length; i++) {
		var innerText = labelBoxes[i].innerText;
		var justTheKeyword = innerText.replace(/\s\d*$/g, "");
		if (justTheKeyword == singleMatch) {
			var listItem = document.createElement("li");
			var listItemLink = document.createElement("a");
			listItemLink.appendChild(document.createTextNode(singleMatch));
			listItemLink.setAttribute("href", "#"+uniqueId);
			listItem.appendChild(listItemLink);
			var contentDiv = labelBoxes[i].nextElementSibling;
			var ul = contentDiv.getElementsByTagName("ol");
			ul[0].appendChild(listItem);
		}	
	}
}
	
function showOccurrences() {
	document.getElementById('show-keywords').click();
}

function clearAll() {
	localStorage.clear();
	var box = document.getElementById("keywords");
	box.innerHTML = "";

	var article = document.getElementById("article");
	var articleContent = article.innerHTML;

	var keywords = document.getElementsByClassName("added-keywords");
	for (var i = 0; i < keywords.length; i++) {
		var content = keywords[i].innerHTML;
		articleContent = articleContent.replace(keywords[i].outerHTML, content);
	}
	article.innerHTML = articleContent;
}

function removeSpan() {
	var list = document.getElementsByClassName("articles");
	for (var i = 0; i < list.length; i++) {
		var icon = list[i].getElementsByTagName("i");
		for (var l = 0; l<icon.length; l++) {
			icon[l].remove();
		}
	}

	var h3Elements = document.getElementsByTagName("h3");
	for (var i = 0; i < h3Elements.length; i++) {
		var newText = "";
		var span = h3Elements[i].getElementsByTagName("span");
		for (var l = 0; l < span.length; l++) {
			var content = span[l].innerText;
			newText = newText+content;
		}
		h3Elements[i].innerHTML = newText;
	}
}

//Code for the 1910s style
function increaseFont() { 
	var h3Elements = document.getElementsByTagName("h3");
	for (var i=0; i < h3Elements.length; i++) {
		var text = h3Elements[i].innerHTML;
		var newString = "";
		var fontSize = 120;
		if (!text.includes("span")) {
			for (var l=0; l<text.length; l++) {
				if (fontSize > 5) {
					fontSize = fontSize - 5;
					fontSize = fontSize.toFixed(2);
				}
				var span = "<span style=\"font-size:"+fontSize+"%\";>"+text[l]+"</span>";
				newString = newString+span;
			} 
			h3Elements[i].innerHTML = newString ;
		}
	}
	addIcons();
}

function addIcons() {
	var list = document.getElementById("articleslist");
	var buttons = list.getElementsByTagName("button");

	for (var i=0; i<buttons.length; i++) {
		if (buttons[i].childElementCount === 0) {
			var icon = document.createElement("i");
			icon.setAttribute("class", "fas fa-fighter-jet");
			buttons[i].appendChild(icon);
		}
	}
}

$(document).on("click", "#hiddenMetadataBox", function() {
	var box = document.getElementsByTagName("aside");
	if ($(box[0]).hasClass("collapse")) {
			$(box[0]).removeClass("collapse");
		}
	else {
		$(box[0]).addClass("collapse");
	}
})