
(function(){

var user = {},
	_vocabularyArray = [],
	_showWordSwitcher;

user.name = 'user1';
user.password = '123';
user.currentVocabulary = "volLib/cet6.xml";
user.wordsInProcess = [];
user.options = {};
user.options.browseWordSpeed = 2000;
user.options.startIdx = 0;

	
function init(){
	_vocabularyArray = [];
	options.startIdx = 0;
}

function getCookie() {	
	var cookies = document.cookie.split(";");
	return cookies;
}

function parseCookie () {
	var i,
		cookies,
		cookieCrumbs,
		cookieName,
		cookieValue;
	
	cookies = getCookie();
	for (var i = 0; i < cookies.length; i++){
		cookieCrumbs = cookies[i].split("=");
		cookieName = cookieCrumbs[0];
		cookieValue = cookieCrumbs[1];
		alert(cookieName);
		if(cookieName == 'Force_Memory_user.password') {
			alert('match');
		}
		switch (cookieName) {
			case 'Force_Memory_user.name':
				alert('name');
				user.name = cookieValue;
				break;
			case "Force_Memory_user.password":
				alert('password');
				user.password = cookieValue;
				break;
			case 'Force_Memory_user.currentVocabulary':
				user.currentVocabulary = cookieValue;
				break;
			case 'Force_Memory_user.option':
				parseOptionString(cookieValue);
				break;
			case 'Force_Memory_user.wordsInProcess':
				parseWordProcessString(cookieValue);
				break;
			default: alert('doesn\'t match');break;
		}

	}	
	// alert('user.name=' + user.name);
	// alert(user.password);
	// alert('vol='+user.currentVocabulary);
	// alert(user.options.browseWordSpeed + ' : ' + user.options.startIdx);

}


function parseOptionString (optionString) {
	var options = optionString.split('|');
	user.options.browseWordSpeed = (parseFloat(options[0]));
	user.options.startIdx = (parseFloat(options[1]));
	alert(parseFloat(options[0])+'   :  '+parseFloat(options[1]));
}

function parseWordProcessString(wordsInProcess) {
	var i,
		processObj,
		processArr;
	
	processArr = wordsInProcess.split('|');
	processArr.shift();
	for(i = 0; i < processArr.length; i++) {
		processObj = processArr[i].split('*');
		user.wordsInProcess[i].idx = processObj[0];
		user.wordsInProcess[i].progress = processObj[1];
		
	}
}

function setCookie () {
	document.cookie = 'Force_Memory_user.name' + '=' + user.name;
	document.cookie = 'Force_Memory_user.password' + '=' + user.password;
	document.cookie = 'Force_Memory_user.currentVocabulary' + '=' + user.currentVocabulary;
	document.cookie = 'Force_Memory_user.option' + '=' + getOption();
	document.cookie = 'Force_Memory_user.wordsInProcess' + '=' + getWordProcess();
}


function getOption () {
	var optionString = '';
	
	optionString += user.options.browseWordSpeed;
	optionString += '|' + user.options.startIdx;
	return optionString;
}

function getWordProcess () {
	var i,
		progressString;
		
	progressString = '';
	for(i = 0; i < user.wordsInProcess.length; i ++) {
		progressString += '|' + user.wordsInProcess[i].idx;
		progressString += '*' + user.wordsInProcess[i].progress;
	}
	return progressString;
}
	
function getArrayContent(word) {
	var i,
		wordObject,
		continuousSpace;
		
	wordObject = {};
	continuousSpace = 0;
	for(i = 0; i < word.length; i++) {
		if(word.charCodeAt(i) === 32) {
			continuousSpace += 1;
		}
		else {
			continuousSpace = 0;
		}
		if(continuousSpace > 4 || continuousSpace === 4){
			continuousSpace = 0;
			wordObject.englishWord = word.slice(0, i);
			wordObject.chineseNotation = word.slice(i);
		}
	}
	return wordObject;
}

function libSourceParser(stringFile) {
	var i,
		word,
		charCode,
		alpIdxEnd,
		alpIdxStart,
		stringSource;
		
	alpIdxStart = 0;
	// $('#showCurrentWord').empty().append(stringFile);
	try{
		for (i = 0; i < stringFile.length; i++) {
			chr = stringFile.charAt(i);
			charCode = stringFile.charCodeAt(i);
			if (charCode === 10) {
				alpIdxEnd = i;
				word = stringFile.slice(alpIdxStart, alpIdxEnd);
				alpIdxStart = i + 1;
				if(word.length !== 0){
					_vocabularyArray.push(word);
				}
			}
			
		}
	}
	catch (e) {
		alert(e);
	}

}

function loadVocabulary () {
	try {
		$.ajax({
			url: user.currentVocabulary,
			type: 'GET',
			dataType: 'txt',
			success: function(data) {
				$(data).find('definition').each(function (idx, innerData) {
					libSourceParser(innerData.textContent);
				});
				alert('loading complete');
			}
		});	
	} 
	catch (e) {
		alert(e);
	}
}

function showWord(){
	var currentWord;

	currentWord = {};
	if(user.options.startIdx >= 0 && user.options.startIdx < _vocabularyArray.length){
		currentWord = getArrayContent(_vocabularyArray[user.options.startIdx]);
		user.options.startIdx += 1;
		$('#showCurrentWord').fadeOut('fast', function () {
			$(this).html(currentWord.englishWord + '<br/><br/>' + 
				currentWord.chineseNotation);
		});
		$('#showCurrentWord').fadeIn('fast');
	}
	else {
		user.options.startIdx = 0;
	}
}

function startShowWord () {
	showWord();
	_showWordSwitcher = setInterval(showWord, user.options.browseWordSpeed);
}

function stopShowWord () {
	clearInterval(_showWordSwitcher);
}

$(document).ready(function () {
	$('#newUser').click(function() {
		loadVocabulary();
		return false;
	});
	$('#startShowWord').click(function() {
		if(_vocabularyArray.length > 0){
			startShowWord();
		}
		else {
			alert('you haven\'t select any word library');
		}
		return false;
	});
	$('#stopReadWord').click(function () {
		stopShowWord();
		return false;
	});
	$('#previous').click(function () {
		user.options.startIdx = user.options.startIdx - 2;
		showWord();
		stopShowWord();
	});	
	$('#next').click(function () {
		showWord();
		stopShowWord();
	});
	// $('#newWordDialog').hide();
	$('#setCookie').click(function () {
		setCookie();
		return false;
	});
	$('#getCookie').click(function () {
		parseCookie();
		return false;
	});
});

}());


