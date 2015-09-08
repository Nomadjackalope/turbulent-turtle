function Task(name, start, end, id) {
	this.name = name;
	this.start = start;
	this.end = end;
	this.id = id;	
}

var tasksArr = [];

// add new last() method:
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

var freshTask = false;

// Hour of the day to begin with.
var dayBegin = 8;


function createLines() {
	var calendar = document.getElementById('week');
	
	// Make 7 rows
	for(var i = 0; i < 7; i++) {
		var day = document.createElement("div");
		day.setAttribute("id", "day" + i);
        day.setAttribute("class", "day");
		calendar.appendChild(day);
		
		// Make 27 column lines
		for(var j = 0; j < 27; j++) {
			// Add lines
			var halfHour = document.createElement("div");
            halfHour.setAttribute("id", "" + (i * 100 + j));
            halfHour.setAttribute("class", "halfHour");
			halfHour.setAttribute("onmousedown", "createTask(this)");
			halfHour.setAttribute("onmousemove", "updateTime(this)");
			halfHour.setAttribute("onmouseup", "finalizeTaskTime(this)");
            //halfHour.innerHTML= "-";
            day.appendChild(halfHour);
		}
	}	
}

function createTask(halfHour) {
	
	if(freshTask) {
		document.getElementById('textinput').parentElement.remove(document.getElementById('textinput'));
	}
	
	tasksArr.push(new Task("", Number(halfHour.id), Number(halfHour.id), 0));
	
}

function updateTime(halfHour) {
	
	tasksArr.last().end = Number(halfHour.id);
	
}

function finalizeTaskTime(halfHour) {
	
	tasksArr[tasksArr.length - 1].end = Number(halfHour.id);
	freshTask = true;
	
	var halfHourStart = halfHour;
	
	halfHourStart.innerHTML="";
	
	var taskNameTextInput = document.createElement("INPUT");
	taskNameTextInput.setAttribute("id", "textinput");
	taskNameTextInput.setAttribute("type", "text");
	taskNameTextInput.setAttribute("onkeydown", "finalizeTask(event, this)");
	
	halfHourStart.appendChild(taskNameTextInput);
	
	//halfHour.innerHTML="";
	
	halfHour.lastChild.focus();

	halfHourStart.lastChild.focus();
		
	//alert(tasksArr.last().start + ", " + tasksArr.last().end);
	
}

function finalizeTask(event, taskNameInput) {
	
	if(event.keyCode == 13) {
		
		//Autocomplete to an available task
		//If available task copy id
		
		//If no available task simply add name
		tasksArr.last().name = taskNameInput.value;
		
		document.getElementById(tasksArr.last().start).innerHTML = tasksArr.last().name;
		taskNameInput.parentElement.removeChild(taskNameInput);
	}
	
	freshTask = false;
	
}

// Returns actual time of day in the format: hrs. Ex. dayBegin = 8, halfHour = 3 -> return = 9.5
function getRealTime(halfHour) {
	return dayBegin + halfHour * 0.5;
}

// Returns halfHour. Ex. dayBegin = 8, realTime = 9.5 -> return = 3
function getHalfHour(realTime) {
	return (realTime - dayBegin) / 0.5;
}

// Returns actual time formatted properly Ex. 
function getRealTimeFormatted(realTime) {
	var formatted = "";
	var isHalf;
	
	isHalf = realTime % 1 != 0;
	
	if(isHalf) {
		realTime -= 0.5;
	}
	
	if(realTime > 12) {
		formatted += (realTime - 12);
	} else {
		formatted += realTime;
	}
	
	formatted += ":"
	
	if(isHalf) {
		formatted += "30";
	} else {
		formatted += "00";
	}
	
	
	return formatted; 
}
