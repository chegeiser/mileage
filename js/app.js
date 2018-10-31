document.addEventListener('deviceready', function () {
    // cordova.plugins.printer is now available
}, false);

function myPrint(){
	var page = document.getElementById('mpgTable');
	cordova.plugins.printer.print(page, 'Document.html');
}

function BlockMove(event) {
 // Tell Safari not to move the window.
 event.preventDefault() ;
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function addAnother(){
	var x = document.getElementById("addEntry");
    if (x.style.display === "block") {
        clearFields();
    } else if (x.style.display = "none") {
		clearFields();
		x.style.display = "block";}
	
	var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "none";
    }
	
	var x = document.getElementById("delDiv");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "none";
    } 
}

$(document).on('click', '#mpgTableData tr', 
	function(){ 
		var thisID = ($(this).find('td:first').html());
		getReport(thisID);
		addDeleteBtn();
		var x = document.getElementById("addEntry");
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "block";
		}
	
		var x = document.getElementById("delDiv");
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "block";
		}
	});

function addDeleteBtn(){
    var deldiv = document.getElementById("delDiv");
	var deleteBtn = "<input type="+"'button' "+"value="+"'Delete' "+"onClick="+"'deleteEntry()' "+
		"class="+"'btn no-print inner' "+"style="+
		"'width: 100px; background-color:#f90000; color:#000000; font-weight : bold' "+" >"
	deldiv.innerHTML = deleteBtn;
}

function deleteEntry() {
	var dlt = confirm("Are you sure you want to delete this entry?");
	if (dlt == true){
	var thisID =  form.ID.value;
	var car =  form.carField.value;
	var thisdate = form.dateField.value;
	local.get(thisID).then(function(doc) {
		return local.remove(doc);
	});
	local.sync(remote).then(function(){
	clearFields();
	}).then(function(){
		alert("Mileage posted on " + thisdate + " for the " + car + " has been deleted.");
		location.reload();
	});
	}
}

function getReport(thisID){
	local.get(thisID).then(function(thisID){
		var car = thisID.car || '';
		var miles = thisID.miles || '';
		var gallons = thisID.gallons || '';
		var avgmpg = thisID.avgmpg || '';
		var notes = thisID.notes || '';
		var thisRev = thisID._rev;
		var ID = thisID._id || 'none';
		var date = thisID.localDate;
		var time = thisID.localTime;
/*		addReport(thisID, thisRev);	*/	
		window.document.getElementById("carField").value=car;
		window.document.getElementById("milesField").value=miles;
		window.document.getElementById("gallonsField").value=gallons;
		window.document.getElementById("avgmpgField").value=avgmpg;
		window.document.getElementById("notesField").value=notes;
		window.document.getElementById("REV").value=thisRev;
		window.document.getElementById("ID").value=ID;
		window.document.getElementById("dateField").value=date;
		window.document.getElementById("timeField").value=time;
	});
	$('html,body').animate({scrollTop:0},0);
	document.getElementById("mpgTable").style.display="none";	
	// console.log(window.document.getElementById("ID"));
}
////////// END - THIS WORKS!!!!!!!!!! /////////////////////////////////////////////////////////////////////////	


// var user = {
//   name: form.user.value,
//   password: form.password.value
// };
//
// var pouchOpts = {
//   skip_setup: true
// };
//
// var ajaxOpts = {
//   ajax: {
//     headers: {
//       Authorization: 'Basic ' + window.btoa(user.name + ':' + user.password)
//     }
//   }
// };

var form, addReport;
form = window.document.reportform;

var local = new PouchDB('mileage');
var remote = new PouchDB('https://db.cebaxo.com:6984/mileage');
var opts = {
  live: true,
  // filter: function(doc) {
  //   return doc._id.indexOf("_design") !==0;
  // }
  //
  filter: function (doc) {
    return doc.hidden === "true";
  }
};

function addReport() {
  var o = {}, that = this;
	// var myDB = DB.value;
	// console.log("DB is at ",myDB);
	o.car = form.carField.value;
	o.miles = form.milesField.value;
	o.gallons = form.gallonsField.value;
	o.avgmpg = form.avgmpgField.value;
	o.notes = form.notesField.value;
	o.thisID = form.ID.value;
	o.thisRev = form.REV.value;
	o.date = form.dateField.value;
	o.time = form.timeField.value;
	thisID =  form.ID.value;
	thisRev = form.REV.value;
	// var inputFile = document.querySelector("#files");	
/*	var thisID = window.thisID;
	var thisRev = window.thisRev;*/
//	console.log("ID= ", thisID);


    if (o.car === "" && o.gallons == ""){
		alert("You must choose a car and enter the number of gallons pumped.");
	} else {
		if (thisID === 'none' || thisID === ''){
			var mileageDoc = {
			_id: new Date().toISOString(),
			localDate: new Date().toLocaleDateString("en-US"),
			localTime: new Date().toLocaleTimeString(),
			car: o.car,
			miles: o.miles,
			gallons: o.gallons,
			avgmpg: o.avgmpg,
			notes: o.notes,
			hidden: "false"
			};
		} 
		else {
			var mileageDoc = {
			_id: thisID,
			_rev: thisRev,
			localDate: o.date,
			localTime: o.time,
			car: o.car,
			miles: o.miles,
			gallons: o.gallons,
			avgmpg: o.avgmpg,
			notes: o.notes,
			hidden: "false"
			};
		}

    //   local.put(mileageDoc).then(function (response) {
    //     clearFields();
    //   }).catch(function (err){
    //     console.log("error", err);
    //   })
    // }
    // else if ((miles !== "") ) {
        console.log("storedFiles1 count =", storedFiles1.length);
        local.put(mileageDoc).then(function (response) {
          return Promise.all(storedFiles1.map(function(storedFile1) {
            return local.putAttachment(response.id, storedFile1.name, response.rev, storedFile1, storedFile1.type);
          }));
        }).then(function () {
          console.log("done");
        }).catch(function (err) {
          console.log("error", err);
        });
    //}
    // else {
    //   console.log("Fill out details in order to submit data.");
    // }
  local.replicate.to(remote);
  clearFields();
}
}

function clearFields() {
    form.carField.value = "";
    form.milesField.value = "";
    form.gallonsField.value = "";
    form.avgmpgField.value = "";
    form.notesField.value = "";
    form.files1.value = "";
    form.ID.value = "";
    form.REV.value = "";
    $("#selectedFiles1").empty();
    // form.files2.value = "";
    // $("#selectedFiles2").empty();
}

// document.getElementById.("showMileage").onclick = function () {
//   local.replicate.from(remote);
//   local.allDocs({ include_docs: true, attachments: false, descending: true },
//       function(err, doc) {
//           showTableOfReports(doc.rows);
//       });
// };

function showReports() {
    local.sync(remote).then(function(){
    local.allDocs({ include_docs: true, attachments: false, descending: true },
        function(err, doc) {
            showTableOfReports(doc.rows);
			var element = document.getElementById("mpgTable");
			element.scrollIntoView();
        });
	});
	var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "block";
    }
	var x = document.getElementById("addEntry");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
	var x = document.getElementById("header");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function showTableOfReports(data) {
    var div = document.getElementById("mpgTable");
	// var calcavg = data[i].doc.miles / data[i].doc.gallons;
    var str = "<header class="+"'banner'"+" >"+"<h2 align="+"'center'"+">MPG Data</h1>"+"</header>"+"<table id="+
		"\'mpgTableData'"+"style="+"'margin: 0px auto;'"+"class="+"\'tbody1'"+"><tr><th>ID</th><th>Date&nbsp&nbsp</th>"+
        "<th>Car&nbsp&nbsp</th><th>Miles&nbsp&nbsp</th><th>Gallons&nbsp&nbsp</th><th>Avg MPG</th></tr>";
    for (var i = 0; i < data.length; i++) {
        str += "<tr><td style=" +"\'display:none;'>" + data[i].doc._id + //"&nbsp&nbsp&nbsp" +
			"</td><td>" + data[i].doc.localDate + "&nbsp&nbsp&nbsp" +
            "</td><td>" + data[i].doc.car + "&nbsp&nbsp&nbsp" +
            "</td><td>" + data[i].doc.miles + "&nbsp&nbsp&nbsp" +
            "</td><td>" + data[i].doc.gallons + "&nbsp&nbsp&nbsp" +
			"</td><td>" + data[i].doc.avgmpg +  "</td></tr>";
    }
    str += "</mpgTableData>";
    div.innerHTML = str;
	document.getElementById("mpgTable").style.display="table";
}
