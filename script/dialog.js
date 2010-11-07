(function () {
	var _myDialog = {};
	
	_myDialog.newWordDialog = function (newWordContent) {
		var content,
			learningHandler;
		
		content = '';
		content += '<center id="newWorddialogCenter"><div id = "wordOnLearning"></div>';
		content += '</center>';
		content += '<input type="button" id="newWordDialog_OK" value ="OK" />';
		content += '<button id="newWordDialog_SKIP">Skip</button>';
		$('#newWordDialog').append(content);
		learningHandler = handleLearningProcess(newWordContent);
		if(learningHandler || learningHandler === 0) {
			return learningHandler;
		}
		
	}
	
	function handleLearningProcess(newWordContent){
		// var wordResultHandler;
		
		$('#wordOnLearning').each(function () {
			$(this).append(newWordContent.chineseNotation + '<br/><br/>');
			$(this).append(newWordContent.englishWord);
		});
		return $('#newWordDialog_SKIP').click(function () {
			destroyCurrentWord();
			return false;
		});
		return $('#newWordDialog_OK').click(function () {
			var eventHandler;
			
			addRecallPart();
			$('#english').hide();
			$('#newWordDialog_OK').hide();
			$('#wrongTip').hide();
			$('#rightTip').hide();
			$('#wordOnLearning').click(function () {
				$('#english').fadeIn();
			});
			
			eventHandler = keyUpEvent();
			if(eventHandler){alert('true');}
			return eventHandler;
		});

		
	}
	
	function addRecallPart () {
		$('#wordOnLearning').empty().append(newWordContent.chineseNotation + 
				'<div id="english">'+ newWordContent.englishWord +'</div>');
		$('#newWorddialogCenter').append('<input type="text" id="wordRecall" />' + 
			'<img src="image/wrong.png" id="wrongTip">' + 
			'<img src="image/right.png" id="rightTip">');
		return;
	}
	
	function keyUpEvent () {
		return $('#wordRecall').focus().keyup(function (event) {
			if($(this).val() === newWordContent.englishWord){
				$('#wrongTip').hide();
				$('#rightTip').show();
				if(event.keyCode === 13){
					return true;
				}
			}
			else {
				$('#wrongTip').show();
			}
		});
		
	}
	
	function destroyCurrentWord () {
		$("#newWordDialog").empty();
		return;
	}
	
	
	window.myDialog = _myDialog;
}());