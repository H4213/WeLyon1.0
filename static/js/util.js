var URL = "http://127.0.0.1:5000";


function doGetPins (parameters)
{
	$.ajax({
		url : URL+parameters,
		dataType : "jsonp",
		method : "GET",
		data : {},
		success : function (data) {
			console.log('Success');
			pins = data.pins;
			pins.forEach(function(pin , index) {  	
    			addMarker(pin);
    		});
		},
		error : function () {
			console.log('Error');
		}
	});	
}

function doPost (parameters){
	$.ajax({
		url : URL,
		dataType : "json",
		method : "POST",
		async : false,
		data : parameters,
		success : function () {
			console.log('Success');
		},
		error : function () {
			console.log('Error');
		}
	});
}


function doPut (parameters) {
	$.ajax({
		url : URL,
		dataType : "json",
		method : "PUT",
		async : false,
		data : parameters,
		success : function (resp) {
			console.log('Success');
		},
		error : function () {
			console.log('Error');
		}
	});
}

function doDelete (parameters) {
	$.ajax({
		url : URL,
		dataType : "json",
		method : "DELETE",
		async : false,
		data : parameters,
		success : function (resp) {
			console.log('Success');
		},
		error : function () {
			console.log('Error');
		}
	});
}
