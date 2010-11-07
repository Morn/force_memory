(function () {

	var _ebbinghaus = {};
		
	_ebbinghaus.simplifyTimeString = function (timeString) {
		var timeArr,
			tempArr,
			hourMins,
			simplifiedTimeString;
		
		timeArr = timeString.split(' ');
		tempArr = timeArr[4].split(':');
		tempArr.pop(':');
		hourMins = tempArr.join(':');
		simplifiedTimeString = timeArr[2] + '-' + timeArr[3] + '-' + hourMins;
		return simplifiedTimeString;
	}
	
	_ebbinghaus.createCycle = function () {
		var i,
			cycleArray,
			reviewTime,
			currentTime,
			cycleTimePoint;
			
		cycleArray = [];
		reviewTime = '';
		currentTime = new Date();
		cycleTimePoint = currentTime;
		//cycle 1 in 5 mins
		cycleTimePoint.setMinutes(5 + cycleTimePoint.getMinutes());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 2 in 30 mins
		cycleTimePoint.setMinutes(30 + cycleTimePoint.getMinutes());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 3 in 12 hours
		cycleTimePoint.setHours(12 + cycleTimePoint.getHours());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 4 in one day
		cycleTimePoint.setDate(1 + cycleTimePoint.getDate());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 5 in 2 days
		cycleTimePoint.setDate(2 + cycleTimePoint.getDate());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 6 in 4 days
		cycleTimePoint.setDate(4 + cycleTimePoint.getDate());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 7 in 7 days
		cycleTimePoint.setDate(7 + cycleTimePoint.getDate());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		//cycle 8 in 15 days
		cycleTimePoint.setDate(15 + cycleTimePoint.getDate());
		cycleArray.push(_ebbinghaus.simplifyTimeString(cycleTimePoint.toString()));
		
		return cycleArray;
	}

	window.ebbinghaus = _ebbinghaus;

}());