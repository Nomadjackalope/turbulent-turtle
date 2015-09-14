function Task(name, start, end, id) {
	this.name = name;
	this.start = start;
	this.end = end;
	this.id = id;	
}

var idCount = 0;

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
	
	// Make 13 hour rows
	for(var i = 0; i < 26; i++) {
		var hourSlot = document.createElement("tr");
		hourSlot.setAttribute("id", "hourSlot" + i);
        hourSlot.setAttribute("class", "hourSlot");
		calendar.appendChild(hourSlot);
		
		var isOdd;
		if(i % 2 != 0) {
			isOdd = true;
		} else {
			isOdd = false;
		}
		
		// Add time column
		var time = document.createElement("td");
		
		if(!isOdd) {
			if(i/2 + dayBegin > 12) {
				time.innerHTML = (i/2 + dayBegin - 12) + "pm";
			} else {
				time.innerHTML = (i/2 + dayBegin) + "am";
			}
			
			time.setAttribute("class", "priTime");
		} else {
			time.innerHTML = "&nbsp";
			time.setAttribute("class", "secTime");
		}
		hourSlot.appendChild(time);
		
		if(Math.ceil((i+1)/2) % 2 != 0) {
			time.style.backgroundColor = "#ececec";
		}
		
		
		
		
		// Make 7 day columns
		for(var j = 0; j < 7; j++) {
			// Add days
			//var hour = document.createElement("td");
            
            //hour.setAttribute("class", "hour");
            
			//if(isOdd) {
			//	hour.style.backgroundColor = "#ececec";
			//}
			
			//hourSlot.appendChild(hour);
			
			var iAdj = i * 2;
			
			// If 2nd half hour(or 1st. I haven't checked yet)
			if(i % 2 == 0) {
		
			// Add both half hour pieces
			var halfHourPri = document.createElement("td");
			halfHourPri.setAttribute("class", "priHalfHour");
			halfHourPri.setAttribute("id", "" + (j * 100 + iAdj));
			halfHourPri.setAttribute("onmousedown", "createTask(this)");
			//halfHourPri.setAttribute("onmousemove", "updateTime(this)");
			halfHourPri.setAttribute("onmouseup", "finalizeTaskTime(this)");
			
			if(Math.ceil((i+1)/2) % 2 != 0) {
				halfHourPri.style.backgroundColor = "#ececec";
			}
			
			hourSlot.appendChild(halfHourPri);
			
			} else {
			var halfHourSec = document.createElement("td");
			halfHourSec.setAttribute("class", "secHalfHour");
			halfHourSec.setAttribute("id", "" + (j * 100 + iAdj + 1));
			halfHourSec.setAttribute("onmousedown", "createTask(this)");
			//halfHourSec.setAttribute("onmousemove", "updateTime(this)");
			halfHourSec.setAttribute("onmouseup", "finalizeTaskTime(this)");
			
			if(Math.ceil((i+1)/2) % 2 != 0) {
				halfHourSec.style.backgroundColor = "#ececec";
			}
			
			hourSlot.appendChild(halfHourSec);
			}
			
			
		}
	}	
}

function createTask(halfHour) {
	
	console.log("create");
	
	if(freshTask) {
		removeTextInput();
	}
	
	tasksArr.push(new Task("", Number(halfHour.id), Number(halfHour.id), idCount++));
	
}

function updateTime(halfHour) {
	// As mouse moves, get new end time
	tasksArr.last().end = Number(halfHour.id);
	
}

// Onmouseup gets endtime and sets task to that length, opens a text input ready for typing
function finalizeTaskTime(halfHour) {
	
	// Sets endtime on the task being made
	tasksArr.last().end = Number(halfHour.id);
	
	// Gets start time and associated halfHour
	var halfHourStart = document.getElementById(tasksArr.last().start);
	
	// Sets freshTask to true so that on new task the input might be removed
	freshTask = true;
	
	// Clears end time text
	//halfHour.innerHTML="";
	
	// Creates input box	
	var taskNameTextInput = document.createElement("INPUT");
	taskNameTextInput.setAttribute("id", "textinput");
	taskNameTextInput.setAttribute("type", "text");
	taskNameTextInput.setAttribute("onkeydown", "finalizeTask(event, this)");
	halfHourStart.appendChild(taskNameTextInput);
	
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
		
		// Remove text input box
		removeTextInput();
		
		// Save task locally
		console.log(saveTask());
		
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

// Removes textinput
function removeTextInput() {
	if(document.getElementById('textinput') != null) {
		var node = document.getElementById('textinput').parentElement;

		node.removeChild(node.firstChild);
	}
}

//--------------------- Storage ---------------------//

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}


function saveTask() {
	if (!supports_html5_storage()) { return false; };
	
	for(var i = 0; i < tasksArr.length; i++) {
		localStorage["task." + i + ".id"] = tasksArr[i].id;
		localStorage["task." + i + ".name"] = tasksArr[i].name;
		localStorage["task." + i + ".start"] = tasksArr[i].start;
		localStorage["task." + i + ".end"] = tasksArr[i].end;
	}
	
	return true;
}

function resume() {
	//Checks for local storage support
	if(!supports_html5_storage()) { return false; };
	
	// Populates the tasksArr & adds tasks to calendar
	// localstorage.length is the total length of all the elements
	for(var i = 0; i < localStorage.length / 4; i++) {
		tasksArr.push(new Task(localStorage["task." + i + ".name"],
			localStorage["task." + i + ".start"],
			localStorage["task." + i + ".end"],
			localStorage["task." + i + ".id"]));
		
		document.getElementById(tasksArr.last().start).innerHTML = tasksArr.last().name;		
		
	}	
	
	return true;
}
