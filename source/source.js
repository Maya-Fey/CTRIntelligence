var catnames = ["Trump Bad", "Hillary Good", "3rd Party Bad", "Actual News"];
var catcolors = ["rgba(255, 0, 0, 0.4)", "rgba(80, 80, 255, 0.4)", "rgba(208, 208, 48, 0.4)", "rgba(0, 160, 0, 0.4)"];
var catbtne = ["#F00", "#55F", "#CC3", "#0A0"];
var catbtnd = ["#900", "#33A", "#992", "#070"];
var cats = [[],[],[],[]];
var posts = [];
var postids = [];

var POST_AUTHOR = 0;
var POST_DOMAIN = 1;
var POST_SCORE = 2;
var POST_COMMENTS = 3;
var POST_TIME = 4;

var suspects = [];
var badnews = ["buzzfeed.com", "dailymail.co.uk", "hillaryclinton.com"];

function obfuscate(str)
{
	var charr = [];
	for(var i = 0; i < str.length; i++)
		charr.push(str.charCodeAt(i) + ((i % 5) + 1));
	var nstr = "";
	for(var i = 0; i < str.length; i++)
		nstr += String.fromCharCode(charr[i]);
	return nstr;
}

function deobfuscate(str) 
{
	var charr = [];
	for(var i = 0; i < str.length; i++)
		charr.push(str.charCodeAt(i) - ((i % 5) + 1));
	var nstr = "";
	for(var i = 0; i < str.length; i++)
		nstr += String.fromCharCode(charr[i]);
	return nstr;
}

function importWatchlist(src) 
{
	var arr = src.split('!|!');
	if(arr.length != 2) {
		alert("That database is invalid.");
		return;
	}
	suspects = arr[0].split('!;!');
	badnews = arr[1].split('!+!');
	for(var i = 0; i < suspects.length; i++)
		suspects[i] = deobfuscate(suspects[i]);
	for(var i = 0; i < badnews.length; i++)
		badnews[i] = deobfuscate(badnews[i]);
}

function exportWatchlist()
{
	var str = "";
	if(suspects.length > 0)
		str += obfuscate(suspects[0]);
	for(var i = 1; i < suspects.length; i++)
		str += "!;!" + obfuscate(suspects[i]);
	str += '!|!';
	if(badnews.length > 0)
		str += obfuscate(badnews[0]);
	for(var i = 1; i < badnews.length; i++)
		str += "!+!" + obfuscate(badnews[i]);
	return str;
}

function getWatchlist()
{
	var src = prompt("Enter in your raw watchlist DB");
	if(src == null || src.length == 0)
		return;
	importWatchlist(src);
	updateSources();
	updateAuthors();
	updateSourceSelect();
	updateSuspectSelect();
}

function importCollection(src)
{
	var arr = src.split('!!*!!');
	if(arr.length != 3) {
		alert("That database is invalid.");
		return;
	}
	
	var npostids = [];
	var t = arr[0].split("!,!");
	if(t[0] != "")
		for(var i = 0; i < t.length; i++)
			npostids.push(deobfuscate(t[i]));
	
	var nposts = [];
	t = arr[1].split('!,!');
	if(t[0] != "")
		for(var i = 0; i < t.length; i++) {
			var arr2 = t[i].split("!$!");
			nposts.push([deobfuscate(arr2[0]), deobfuscate(arr2[1]), parseInt(deobfuscate(arr2[2])), parseInt(deobfuscate(arr2[3])), deobfuscate(arr2[4])]);
		}
		
	t = arr[2].split('!|!');
	if(t.length != catnames.length) {
		alert("That database is invalid.");
		return;
	}
	var ncats = [];
	for(var i = 0; i < catnames.length; i++) {
		var cur = t[i].split(",");
		if(cur.length == 1 && cur[0] == "") {
			ncats.push([]);
			continue;
		}
		var ncur = [];
		for(var j = 0; j < cur.length; j++)
			ncur.push(parseInt(deobfuscate(cur[j])));
		ncats.push(ncur);
	}
	cats = ncats;
	posts = nposts;
	postids = npostids;
}

function exportPost(arr)
{
	return obfuscate(arr[0]) + "!$!" + obfuscate(arr[1]) + "!$!" + obfuscate(arr[2] + "") + "!$!" + obfuscate(arr[3] + "") + "!$!" + obfuscate(arr[4]);
}

function exportCollection()
{
	var str = "";
	
	if(postids.length > 0)
		str += obfuscate(postids[0]);
	for(var i = 1; i < postids.length; i++)
		str += "!,!" + obfuscate(postids[i]);
	
	str += '!!*!!';
	if(posts.length > 0)
		str += exportPost(posts[0]);
	for(var i = 1; i < posts.length; i++)
		str += "!,!" + exportPost(posts[i]);
	
	str += '!!*!!';
	var cat = cats[0];
	if(cat.length > 0)
		str += obfuscate(cat[0] + "");
	for(var j = 1; j < cat.length; j++)
		str += "," + obfuscate(cat[j] + "");
	for(var i = 1; i < catnames.length; i++) {
		var cat = cats[i];
		str += "!|!";
		if(cat.length > 0)
			str += obfuscate(cat[0] + "");
		for(var j = 1; j < cat.length; j++)
			str += "," + obfuscate(cat[j] + "");
	}
	return str;
}

function getCollection()
{
	var src = prompt("Enter in your raw collection DB");
	if(src == null || src.length == 0)
		return;
	importCollection(src);
	updateCats();
	updateNewDB();
}

function exportDB()
{
	return exportWatchlist() + "!!<>!!" + exportCollection();
}

function importDB(str)
{
	var t = str.split("!!<>!!");
	if(t.length != 2) {
		alert("That DB is not valid");
		return;
	}
	importWatchlist(t[0]);
	importCollection(t[1]);
}

function getDB()
{
	var str = prompt("Enter your raw DB string here.");
	if(str == null || str.length == 0)
		return;
	importDB(str);
	updateCats();
	updateSources();
	updateAuthors();
	updateSourceSelect();
	updateSuspectSelect();
	updateNewDB();
}

function updateNewDB()
{
	for(var i = 0; i < ids.length; i++) {
		var db = dbFromID(ids[i]);
		if(db != -1)
			updateToDB(db, i);
	}
}

function storeSuspects()
{
	localStorage.setItem("suspects", exportWatchlist());
}

function loadSuspects()
{
	var out = localStorage.getItem("suspects");
	if(out == null) {
		alert("Stored suspect list not found");
		return;
	}
	importWatchlist(out);
}

function storeCollection()
{
	localStorage.setItem("collection", exportCollection());
}

function loadCollection()
{
	var out = localStorage.getItem("collection");
	if(out == null) {
		alert("Stored collection not found");
		return;
	}
	importCollection(out);
}

function storeDB()
{
	storeSuspects();
	storeCollection();
}

function loadDB()
{
	loadSuspects();
	loadCollection();
}

var punc = [',', ':', ';', '.', '"', "'", '(', ')', '-', '*', '@', '?', '!'];

function dbToID(db){return postids[db];};
function dbFromID(id){for(var i = 0; i < postids.length; i++) if(postids[i] == id) return i; return -1;}
function posFromID(id) { for(var i = 0; i < ids.length; i++) if(ids[i] == id) return i;}
function ensureDB(pos) { var rep = dbFromID(ids[pos]); if(rep == -1) { addToDB(pos); return posts.length - 1; } else { return rep; }}
function addToDB(pos){postids.push(ids[pos]); posts.push([authors[pos].innerHTML, domains[pos].innerHTML, scores[pos], comments[pos], times[pos]]);}
function updateToDB(db, pos){posts[db][2] = scores[pos]; posts[db][3] = comments[pos];}
function isInCat(cat, id) { var db = dbFromID(id); if(db == -1) return false; var arr = cats[cat]; for(var i = 0; i < arr.length; i++) { if(arr[i] == db) return true;} return false;}
function addCat(cat, id) { cats[cat].push(ensureDB(posFromID(id))); }
function remCat(cat, id) { var db = dbFromID(id); var arr = cats[cat]; for(var i = 0; i < arr.length; i++) if(arr[i] == db) { arr.splice(i, 1); break; } }
function contains(arr, thing) { for(var i = 0; i < arr.length; i++) { if(arr[i] == thing) return true; } return false; }
function getElementByClassUnique(thing, classname) { var childs = thing.childNodes; for(var i = 0; i < childs.length; i++) { if(contains(childs[i].nodeType == 1 && childs[i].className.split(' '), classname)) return childs[i]; }}
function prepareCompare(thing) { for(var i = 0; i < punc.length; i++) for(var j = 0; j < thing.length; j++) if(thing.charAt(j) == punc[i]) thing = strSplice(thing, j--); return thing; }
function strSplice(str, chr) { return str.slice(0, chr) + str.slice(chr + 1, str.length); }

var TH = ["donald", "trump", "hillary", "clinton", "gary", "johnson", "jill", "stein"];
var CH = ["#F00", "#F00", "#55F", "#55F", "#CC3", "#CC3", "#0A0", "#0A0"];

var raw = [];
var ids = [];
var entries = [];
var titles = [];
var domains = [];
var authors = [];
var comments = [];
var scores = [];
var times = [];

var authornames = [];
var sourcenames = [];
var authorlist = [[],[]];
var sourcelist = [[],[]];

function incList(list, thing) { for(var i = 0; i < list[0].length; i++) if(list[0][i] == thing) { list[1][i]++; return; } list[0].push(thing); list[1].push(1); }

function addCatCur(cat, id) { addCat(cat, id); var btn = document.getElementById(catnames[cat] + id); makeRemBtn(btn, cat, id); }
function remCatCur(cat, id) { remCat(cat, id); var btn = document.getElementById(catnames[cat] + id); makeAddBtn(btn, cat, id); }
function makeAddBtn(button, cat, id) { button.id = catnames[cat] + id; button.setAttribute("style", "border: 1px solid white; color: white; background-color: " + catbtne[cat] + "; margin: 2px auto"); button.setAttribute("onclick", "addCatCur(" + cat + ", '" + id + "')"); button.innerHTML = "Mark as " + catnames[cat]; updateID(id); }
function makeRemBtn(button, cat, id) { button.id = catnames[cat] + id; button.setAttribute("style", "border: 1px solid white; color: white; background-color: " + catbtnd[cat] + "; margin: 2px auto"); button.setAttribute("onclick", "remCatCur(" + cat + ", '" + id + "')"); button.innerHTML = "Unmark as " + catnames[cat]; updateID(id); }
function updateID(id) { var i = 0; while(true) if(ids[i] != id) i++; else break; for(var j = 0; j < cats.length; j++) if(isInCat(j, id)) { entries[i].setAttribute("style", "background-color: " + catcolors[j] + ";"); return; } entries[i].setAttribute("style", ""); }

function updateCats()
{
	for(var i = 0; i < ids.length; i++)
	{
		for(var j = 0; j < catnames.length; j++)
		{
			var btn = document.getElementById(catnames[j] + ids[i]);
			if(isInCat(j, ids[i]))
				makeRemBtn(btn, j, ids[i]);
			else 
				makeAddBtn(btn, j, ids[i]);
		}
	}
}

function updateSources()
{
	for(var i = 0; i < domains.length; i++)
	{
		var ele = domains[i];
		ele.setAttribute("style", "");
		var check = domains[i].innerHTML = sourcenames[i];
		for(var j = 0; j < badnews.length; j++) 
			if(badnews[j] == check) {
				ele.setAttribute("style", "text-decoration: underline; font-weight: bold; color: red;");
				ele.innerHTML += "*";
				break;
			} 
		var auth = -1;
		while(true) 
			if(check == sourcelist[0][++auth])
				break;
		ele.innerHTML += " (" + sourcelist[1][auth] + ")";
	}
}

function updateAuthors()
{
	for(var i = 0; i < authors.length; i++)
	{
		var ele = authors[i];
		ele.setAttribute("style", "");
		var check = authors[i].innerHTML = authornames[i];
		for(var j = 0; j < suspects.length; j++) 
			if(suspects[j] == check) {
				ele.setAttribute("style", "text-decoration: underline; font-weight: bold; color: red;");
				ele.innerHTML += "*";
				break;
			} 
		if(check == "MayaFey_") {
			ele.setAttribute("style", "text-decoration: underline; font-weight: bold; color: #0A0; font-size: 1.2em;");
			ele.innerHTML += " <-- Literal Gospel";
			if(!isInCat(3, ids[i])) {
				addCatCur(3, ids[i]);
			}
		}
		var auth = -1;
		while(true) 
			if(check == authorlist[0][++auth])
				break;
		ele.innerHTML += " (" + authorlist[1][auth] + ")";
	}
}

var kek = [].slice.call(document.getElementsByClassName("link"));
for(var i = 0; i < kek.length; i++) 
{ 
	var elements = kek[i].className.split(' '); 
	if(contains(elements, "stickied") || contains(elements, "promoted")) 
		continue; 
	raw.push(kek[i]);
}

for(var i = 0; i < raw.length; i++) 
{
	var thing = raw[i];
	var entry = entries[i] = getElementByClassUnique(thing, "entry");
	var tentry = getElementByClassUnique(entry, "title");
	domains[i] = getElementByClassUnique(tentry, "domain").childNodes[1];
	sourcenames.push(domains[i].innerHTML);
	incList(sourcelist, domains[i].innerHTML);
	titles[i] = getElementByClassUnique(tentry, "title");
	ids[i] = thing.id;
	var tagline = getElementByClassUnique(entry, "tagline");
	authors[i] = getElementByClassUnique(tagline, "author");
	authornames.push(authors[i].innerHTML);
	incList(authorlist, authors[i].innerHTML);
	times[i] = tagline.childNodes[1].getAttribute("title");
	var buttons = getElementByClassUnique(entry, "buttons");
	var comments_proto = getElementByClassUnique(getElementByClassUnique(buttons, "first"), "comments").innerHTML;
	if(comments_proto == "comment")
		comments[i] = 0;
	else 
		comments[i] = parseInt(comments_proto.split(' ')[0]);
	scores[i] = parseInt(getElementByClassUnique(getElementByClassUnique(thing, "midcol"), "unvoted").innerHTML);
	if(isNaN(scores[i]))
		scores[i] = 0;
	
	tagline.insertBefore(document.createTextNode(" [" + times[i] + "] "), tagline.childNodes[2]);
	tagline.setAttribute("style", "color: black");
	var stats = document.createElement("p");
	entry.insertBefore(stats, getElementByClassUnique(entry, "flat-list"));
	stats.setAttribute("class", "tagline");
	stats.setAttribute("style", "color: black");
	var minsago = (new Date() - new Date(times[i])) / (1000 * 60);
	stats.innerHTML = "V/C ratio: " + ("" + (scores[i] / comments[i])).substr(0, 4) + " net gain/min: " + ("" + (scores[i] / minsago)).substr(0, 4) + " comments/min: " + ("" + (comments[i] / minsago)).substr(0, 4);
	
	for(var j = 0; j < catnames.length; j++)
	{
		var li = document.createElement("li");
		var button = document.createElement("button");
		li.appendChild(button);
		buttons.appendChild(li);
		if(isInCat(j, thing.id)) 
			makeRemBtn(button, j, thing.id);
		else 
			makeAddBtn(button, j, thing.id);
	}
	
	var title = titles[i].innerHTML.split(" ");
	var tnew = "";
	for(var j = 0; j < title.length; j++) {
		var cool = true;
		for(var k = 0; k < TH.length; k++) {
			if(TH[k] == prepareCompare(title[j].toLowerCase())) {
				tnew += '<span style="font-weight: bold; text-decoration: underline; color: ' + CH[k] + ';">' + title[j] + "</span> ";
				cool = false;
				break;
			}
		}
		if(cool) {
			tnew += title[j] + " ";
		}
	}
	titles[i].innerHTML = tnew;
}
updateSources();
updateAuthors();

var t = document.createElement("div");
var main = document.createElement("table");
t.appendChild(main);
var kek = document.getElementsByClassName("content");
for(var i = 0; i < kek.length; i++)
	if(kek[i].getAttribute("role") == "main") {
		kek[i].insertBefore(t, kek[i].childNodes[0]);
		break;
	}

t = main;
main = document.createElement("tbody");
t.appendChild(main);
t.setAttribute("style", "border: 1px solid black; background-color: #EEE; margin-right: 18%; width: 82%");

row = null;
col = null;

function newRow()
{
	row = document.createElement("tr");
	main.appendChild(row);
}

function newCol()
{
	col = document.createElement("td");
	col.setAttribute("style", "padding: 10px");
	row.appendChild(col);
}

function addNewSource()
{
	var src = prompt("Enter a second level domain name (eg. reddit.com) to be added to the list of untrustworthy sources.\n  ");
	if(src == null || src.length == 0)
		return;
	for(var i = 0; i < badnews.length; i++)
		if(src == badnews[i]) {
			alert("You already have that source marked as untrusted");
			return;
		}
	badnews.push(src);
	updateSources();
	updateSourceSelect();
}

function addNewSuspect()
{
	var sus = prompt("Enter a username (NOT INCLDING THE /u/), for example MayaFey_ to be added to the list of shill suspects.\n     ");
	if(sus == null || sus.length == 0)
		return;
	if(sus == "MayaFey_") {
		alert("I'm no shill... ;)");
		return;
	}
	for(var i = 0; i < suspects.length; i++)
		if(sus == suspects[i]) {
			alert("You already have that person marked as a shill");
			return;
		}
	suspects.push(sus);
	updateAuthors();
	updateSuspectSelect();
}

function removeKebab()
{
	badnews.splice(sourceSelect.selectedIndex - 1, 1);
	updateSourceSelect();
	updateSources();
}

function imprisonHillary()
{
	suspects.splice(suspectSelect.selectedIndex - 1, 1);
	updateSuspectSelect();
	updateAuthors();
}

var sourceSelect = document.createElement("select");
var suspectSelect = document.createElement("select");
var outSelect = document.createElement("select");
var dataSelect = document.createElement("select");
var out = document.createElement("textarea");

function newOption(name)
{
	var t = document.createElement("option");
	t.innerHTML = name;
	return t;
}

var t = newOption("Select News Source to Delete");
t.setAttribute("disabled", "");
sourceSelect.appendChild(t);
var t = newOption("Select Innocent Suspect to Delete");
t.setAttribute("disabled", "");
suspectSelect.appendChild(t);

function output(str)
{
	out.value = str;
}

function reportCatTotals()
{
	var text = "";
	var totals = [];
	var total = 0;
	for(var i = 0; i < catnames.length; i++) {
		var t = cats[i].length;
		total += t;
		totals.push(t);
	}
	for(var i = 0; i < catnames.length; i++)
		text += catnames[i] + ": " + totals[i] + " (" + ("" + (100 * (totals[i] / total))).substr(0, 5) + "%)\n";
	text += "Total: " + total;
	output(text);
}

function reportScoreTotals()
{
	var text = "";
	var totals = [];
	var total = 0;
	var totalp = 0;
	for(var i = 0; i < catnames.length; i++) {
		var cat = cats[i];
		totals.push(0);
		for(var j = 0; j < cat.length; j++) 
			totals[i] += posts[cat[j]][POST_SCORE];
		totalp += cat.length;
	}
	for(var i = 0; i < catnames.length; i++) 
		total += totals[i];
	for(var i = 0; i < catnames.length; i++) 
		text += catnames[i] + ": " + totals[i] + " (" + ("" + (totals[i] / total)).substr(0, 5) + ") (" + ("" + (totals[i] / cats[i].length)).substr(0, 5) + " avg score/post)\n";
	text += "Total : " + total + " (" + ("" + (total / totalp)).substr(0, 5) + " avg score/post)"; 
	output(text);
}

function reportCommentTotals()
{
	var text = "";
	var totals = [];
	var total = 0;
	var totalp = 0;
	for(var i = 0; i < catnames.length; i++) {
		var cat = cats[i];
		totals.push(0);
		for(var j = 0; j < cat.length; j++) 
			totals[i] += posts[cat[j]][POST_COMMENTS];
		totalp += cat.length;
	}
	for(var i = 0; i < catnames.length; i++) 
		total += totals[i];
	for(var i = 0; i < catnames.length; i++) 
		text += catnames[i] + ": " + totals[i] + " (" + ("" + (totals[i] / total)).substr(0, 5) + ") (" + ("" + (totals[i] / cats[i].length)).substr(0, 5) + " avg comments/post)\n";
	text += "Total : " + total + " (" + ("" + (total / totalp)).substr(0, 5) + " avg comments/post)"; 
	output(text);
}

function reportAvVC()
{
	var text = "";
	var avs = [];
	var rav = 0;
	for(var i = 0; i < catnames.length; i++) {
		var cat = cats[i];
		avs.push(0);
		for(var j = 0; j < cat.length; j++) 
			avs[i] += posts[cat[j]][POST_SCORE] / posts[cat[j]][POST_COMMENTS];
		avs[i] /= cat.length;
		rav += avs[i];
	}
	rav /= catnames.length;
	for(var i = 0; i < catnames.length; i++) 
		text += catnames[i] + ": " + ("" + avs[i]).substr(0, 4) + "\n";
	text += "Total: " + ("" + rav).substr(0, 4);
	output(text);
}

function reportSuspects()
{
	text = "";
	for(var i = 0; i < suspects.length; i++)
		text += suspects[i] + "\n";
	output(text);
}

function reportBadnews()
{
	text = "";
	for(var i = 0; i < badnews.length; i++)
		text += badnews[i] + "\n";
	output(text);
}

function updateSourceSelect()
{
	var l = sourceSelect.childNodes.length - 1;
	while(l-- > 0)
		sourceSelect.removeChild(sourceSelect.childNodes[1]);
	for(var i = 0; i < badnews.length; i++) {
		sourceSelect.appendChild(newOption(badnews[i]));
	}
}

function updateSuspectSelect()
{
	var l = suspectSelect.childNodes.length - 1;
	while(l-- > 0)
		suspectSelect.removeChild(suspectSelect.childNodes[1]);
	for(var i = 0; i < suspects.length; i++) {
		suspectSelect.appendChild(newOption(suspects[i]));
	}
}

outSelect.appendChild(newOption("Category Totals"));
outSelect.appendChild(newOption("Vote Totals"));
outSelect.appendChild(newOption("Comment Totals"));
outSelect.appendChild(newOption("Average V/C Ratio"));
outSelect.appendChild(newOption("Full Suspect List"));
outSelect.appendChild(newOption("Bad Source List"));

dataSelect.appendChild(newOption("Suspect List"));
dataSelect.appendChild(newOption("Post Collection"));
dataSelect.appendChild(newOption("Full DB"));

function doStatistic()
{
	switch(outSelect.selectedIndex)
	{
		case 0:
			reportCatTotals();
			break;
		case 1:
			reportScoreTotals();
			break;
		case 2: 
			reportCommentTotals();
			break;
		case 3: 
			reportAvVC();
			break;
		case 4:
			reportSuspects();
			break;
		case 5:
			reportBadnews();
			break;
	}
}

function doExport()
{
	switch(dataSelect.selectedIndex)
	{
		case 0:
			output(exportWatchlist());
			break;
		case 1:
			output(exportCollection());
			break;
		case 2:
			output(exportDB());
			break;
	}
}

function doImport()
{
	switch(dataSelect.selectedIndex)
	{
		case 0:
			getWatchlist();
			break;
		case 1:
			getCollection();
			break;
		case 2:
			getDB();
			break;
	}
}

newRow();
	newCol();
		col.setAttribute("colspan", "4");
		t = document.createElement("h1");
		t.innerHTML = "TRC CounterIntelligence Menu";
		t.setAttribute("style", "text-align: center");
		col.appendChild(t);

newRow();
	newCol();
		t = document.createElement("button");
		t.innerHTML = "Add new Bad Source";
		t.setAttribute("onclick", "addNewSource();");
		col.appendChild(t);
		col.appendChild(document.createElement("br"));
		col.appendChild(document.createElement("br"));
		col.appendChild(sourceSelect);
		updateSourceSelect();
		col.appendChild(document.createElement("br"));
		col.appendChild(document.createElement("br"));
		t = document.createElement("button");
		t.innerHTML = "Remove Source from Blacklist";
		t.setAttribute("onclick", "removeKebab();");
		col.appendChild(t);
	newCol();
		t = document.createElement("button");
		t.setAttribute("onclick", "addNewSuspect();");
		t.innerHTML = "Add Untrusted/Suspected User";
		col.appendChild(t);
		col.appendChild(document.createElement("br"));
		col.appendChild(document.createElement("br"));
		col.appendChild(suspectSelect);
		updateSuspectSelect();
		col.appendChild(document.createElement("br"));
		col.appendChild(document.createElement("br"));
		t = document.createElement("button");
		t.innerHTML = "Remove Innocent from Suspect List";
		t.setAttribute("onclick", "imprisonHillary();");
		col.appendChild(t);
	newCol();
		col.appendChild(dataSelect);
		col.appendChild(document.createElement("br"));
		col.appendChild(document.createElement("br"));
		t = document.createElement("button");
		t.setAttribute("onclick", "doImport();");
		t.innerHTML = "Import";
		col.appendChild(t);
		t = document.createElement("button");
		t.setAttribute("onclick", "doExport();");
		t.innerHTML = "Export";
		col.appendChild(t);
	newCol();
		col.appendChild(outSelect);
		col.appendChild(document.createElement("br"));
		col.appendChild(document.createElement("br"));
		t = document.createElement("button");
		t.setAttribute("onclick", "doStatistic()");
		t.innerHTML = "Output";
		col.appendChild(t);
		
newRow();
	newCol();
		col.setAttribute("colspan", "4");
		out.setAttribute("style", "width: 100%");
		col.appendChild(out);

newRow();
	newCol();
		col.setAttribute("colspan", "4");
		t = document.createElement("p");
		t.setAttribute("style", "text-align: center;");
		t.innerHTML = "TRC CounterIntelligence Suite version Beta 1.3, made by <a href=\"https://www.reddit.com/user/MayaFey_\">/u/MayaFey_</a>";
		col.appendChild(t);