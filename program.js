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
            halfHour.setAttribute("id", "halfHour" + j);
            halfHour.setAttribute("class", "halfHour");
            halfHour.innerHTML=j + ", " + i;
            day.appendChild(halfHour);
		}
	}	
}