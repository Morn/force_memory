/*
*Auther: Morn Jen
*App Name: Force Memory 
*
*/

(function () {

	var user = {},
		_vocabularyArray = [],
		_showWordSwitcher;

	user.wordsInProcess = [];
	user.options = {};

		
	function init (){
		_vocabularyArray = [];
		user.options.wordBrowsingIdx = 0;
		user.options.wordLearningIdx = 0;
	}

	function getCookie () {	
		return document.cookie.split(';');
	}

	function parseCookie () {
		var i,
			cookies,
			cookieName,
			cookieValue,
			cookieCrumbs;
		
		cookies = getCookie();
		alert(cookies.join('\n'));
		if(!cookies) {
			alert('Can not get page sate');
			return;
		}
		for (i = 0; i < cookies.length; i++){
			cookieCrumbs = cookies[i].split('=');
			cookieName = cookieCrumbs[0];
			cookieValue = cookieCrumbs[1];
			switch (i) {
				case 0:
					user.name = cookieValue;
					break;
				case 1:
					user.password = cookieValue;
					break;
				case 2:
					user.currentVocabulary = cookieValue;
					break;
				case 3:
					parseOptionString(cookieValue);
					break;
				case 4:
					parseWordProcessString(cookieValue);
					break;
				default: 
					break;
			}
		}
		
	}


	function parseOptionString (optionString) {
		var options = optionString.split('|');
		
		user.options.browseWordSpeed = (parseFloat(options[0]));
		user.options.wordBrowsingIdx = (parseFloat(options[1]));
		user.options.wordLearningIdx = (parseFloat(options[2]));
	}

	function parseWordProcessString (wordsInProcess) {
		var i,
			processObj,
			processArr;
		
		processArr = wordsInProcess.split('|');
		processArr.shift();
		for(i = 0; i < processArr.length; i++) {
			processObj = processArr[i].split('*');
			user.wordsInProcess[i].idx = processObj[0];
			user.wordsInProcess[i].progress = processObj[1].split('^');
			
		}
	}

	function setCookie () {
		try {
			document.cookie = 'Force_Memory_user.name' + '=' + user.name;
			document.cookie = 'Force_Memory_user.password' + '=' + user.password;
			document.cookie = 'Force_Memory_user.currentVocabulary' + '=' + user.currentVocabulary;
			document.cookie = 'Force_Memory_user.option' + '=' + getOption();
			document.cookie = 'Force_Memory_user.wordsInProcess' + '=' + getWordProcess();
			return true;
		}
		catch (e) {
			return false;
		}
	}


	function getOption () {
		var optionString = '';
		
		optionString += user.options.browseWordSpeed;
		optionString += '|' + user.options.wordBrowsingIdx;
		optionString += '|' + user.options.wordLearningIdx;
		
		return optionString;
	}

	function getWordProcess () {
		var i,
			progressString;
			
		progressString = '';
		for(i = 0; i < user.wordsInProcess.length; i ++) {
			progressString += '|' + user.wordsInProcess[i].idx;
			progressString += '*' + user.wordsInProcess[i].progress.join('^');
		}
		return progressString;
	}
	
	function learnNewWord () {
		var i,
			continues,
			newWordObj,
			newWordObjContent,
			newWordDialogHandler;
		
		newWordObj = {};
		newWordObj.progress = [];
		newWordObjContent = {};
		continues = true;
		try {
			if(!user.options.wordLearningIdx && user.options.wordLearningIdx !== 0) {
				alert('fail to get word learning index');
				return;
			}
			while(continues){
				newWordObjContent = 
					getWordLibArrContent(_vocabularyArray[user.options.wordLearningIdx]);
				newWordDialogHandler = window.myDialog.newWordDialog(newWordObjContent);
				if(newWordDialogHandler){
					newWordObj.progress = window.ebbinghaus.createCycle();
					newWordObj.idx = user.options.wordLearningIdx;
					user.wordsInProcess.push(newWordObj);
				}
				else if(newWordDialogHandler === undefined) {
					continues = false;user.options.wordLearningIdx += 1;
				}
				
			}
		
		}
		catch(e) {
			
		}

	}
	
	function cycleRetrieve () {
		var i,
			currentTime,
			currentTimeString;
		
		currentTime = new Date();
		currentTimeString = window.ebbinghaus.simplifyTimeString(currentTime.toString())
		for(i = 0; i < user.wordsInProcess.length; i++) {
			if(currentTimeString == user.wordsInProcess[i].progress[0]) {
				reviewWord(user.wordsInProcess[i].idx);
				user.wordsInProcess[i].progress.shift();
			}
		}
	}
	
	function reviewWord (wordIdx) {
		var wordObj;
		
		
		wordObj = getWordLibArrContent(_vocabularyArray[wordIdx]);
		alert(wordObj.englishWord);
		alert(wordObj.chineseNotation);
		
	}
		
	function getWordLibArrContent (word) {
		var i,
			tempArr,
			wordObject;
			
		wordObject = {};
		tempArr = word.split(' ');
		for	(i = 0; i < tempArr.length;) {
			if(tempArr[i].length === 0) {
				tempArr.splice(i, 1);
			}
			else {
				i++;
			}
		}
		wordObject.englishWord = tempArr[0];
		wordObject.chineseNotation = tempArr[1];
		return wordObject;
	}

	function libSourceParser (stringFile) {
		var i,
			word,
			charCode,
			alpIdxEnd,
			alpIdxStart,
			stringSource;
			
		alpIdxStart = 0;
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
	//TODO: show object poperty
	function whatIs(object) {
		var text = '';
		text += 'type: ' + (object instanceof Array ? 'array' : 
			object instanceof Date ? 'Date' : 
			object instanceof RegExp ? 'RegExp' : 
			typeof object) + '\n';
		if (object === null) {
			text += 'Is null';
		} else if (typeof object !== 'object') {
			text += 'Object has no properties; is of type ' + 
				typeof object + ' with value: ' + object;
		} else if (object instanceof Date) {
			text += object.toString();
		} else if (object instanceof RegExp) {
			text += object.source;
		} else {
			for (var i in object) {
				if (1) { /* JSLINT */
					try {
						text += i + (': ' + object[i] + '\n');
					}
					catch(e) {
						text += i + (': ' + '[[ERROR]] (DOM?)' + '\n');
					}
				}
			}
		}
		alert(text);
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
					// alert('loading complete');
				}
			});	
		} 
		catch (e) {
			alert(e);
		}
	}

	function showWord () {
		var currentWord;

		currentWord = {};
		if(user.options.wordBrowsingIdx >= 0 && user.options.wordBrowsingIdx < _vocabularyArray.length){
			currentWord = getWordLibArrContent(_vocabularyArray[user.options.wordBrowsingIdx]);
			user.options.wordBrowsingIdx += 1;
			$('#showCurrentWord').fadeOut('fast', function () {
				$(this).html(currentWord.englishWord + '<br/><br/>' + 
					currentWord.chineseNotation);
			});
			$('#showCurrentWord').fadeIn('fast');
		}
		else {
			user.options.wordBrowsingIdx = 0;
		}
	}
	
	function timeManage (index) {
		switch (index) {
			case 'showWord':
				_showWordSwitcher = setInterval(showWord, user.options.browseWordSpeed);
				break;
			case 'stopShowWord':
				clearInterval(_showWordSwitcher);
				break;
			case 'retrieve':
				setInterval(cycleRetrieve, 60000);
				break;
		}
		
	}

	function startShowWord () {
		showWord();
		timeManage('showWord');
	}

	function grabNewWord () {
		if(user.wordsInProcess.length > 0){
			
		}
	}

	function getPageState () {
		parseCookie();
		if(user.options.browseWordSpeed === undefined || !user.options.browseWordSpeed) {
			user.options.browseWordSpeed = 2000;
		}
		if(user.options.wordBrowsingIdx === undefined || !user.options.wordBrowsingIdx) {
			user.options.wordBrowsingIdx = 0;
		}
		if(user.options.wordLearningIdx === undefined || !user.options.wordLearningIdx) {
			user.options.wordLearningIdx = 0;
		}
		if(user.name === undefined || !user.name || user.name === '') {
			user.name = 'user1';
		}
		if(user.password === undefined || !user.password ) {
			alert('no password');
			user.password = '123';
		}
		if(user.currentVocabulary === undefined || !user.currentVocabular) {
			user.currentVocabulary = "volLib/cet6.xml";
		}
		// alert(user.name);
		timeManage('retrieve');
		loadVocabulary();
		
	}

	function savePageState () {
		if(!setCookie()) {
			alert('Fail to save page state');
		}
	}

	$(document).ready(function () {
		$('#newUser').click(function() {
			loadVocabulary();
			return false;
		});
		$('#startShowWord').click(function () {
			if (_vocabularyArray.length > 0) {
				startShowWord();
			}
			else {
				alert('you haven\'t select any word library');
			}
			return false;
		});
		$('#stopReadWord').click(function () {
			timeManage('stopShowWord');
			return false;
		});
		$('#previous').click(function () {
			user.options.wordBrowsingIdx = user.options.wordBrowsingIdx - 2;
			showWord();
			timeManage('stopShowWord');
			return false;
		});	
		$('#next').click(function () {
			showWord();
			timeManage('stopShowWord');
			return false;
		});
		$('#newWord').click(function () {
			learnNewWord();
			return false;
		});
		// $('#newWordDialog').hide();
		// $('#setCookie').click(function () {
			// setCookie();
			// return false;
		// });
	});

	window.onload = getPageState;
	window.onbeforeunload = savePageState; 


}());


