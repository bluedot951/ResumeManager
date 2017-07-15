document.onkeydown = checkKey;
document.onload = fetchAllKeys();

var allData = [];
var pos;
function checkKey(e) {
	if (pos >= allData.length) {
		return
	}
	e = e || window.event;

	if (e.keyCode == '37') {

		if(pos >= 0) {
			getLeft(allData[pos]["key"], function(val) {
				var newVal = val + 1;
				console.log("newVal: " + newVal);
				if(newVal == 2) {
					console.log("done with lefts!");
					sendRejectEmail("sujeethjinesh@gmail.com");
					disable(allData[pos]["key"]);
					$("#rejected").fadeIn(1500, function() {
			       		$("#rejected").fadeOut(1500, null);
			       	});
				}
			});
		}

       $("#resume").fadeOut(500, function() {
       		if(pos >= 0) {
				addLeft(allData[pos]["key"]);
			}
       		setNextImage();
       });

       if (pos >= 0) {
	       $("#cross").fadeIn(500, function() {
	       		$("#cross").fadeOut(500, null);
	       });
	   }

       // sendRejectEmail("sg937@cornell.edu");

	}
	else if (e.keyCode == '39') {

		if(pos >= 0) {
			getRight(allData[pos]["key"], function(val) {
				var newVal = val + 1;
				console.log("newVal: " + newVal);

				if(newVal == 2) {
					console.log("done with rights!");
					sendAcceptEmail("sg937@cornell.edu");
					disable(allData[pos]["key"]);
					$("#accepted").fadeIn(1500, function() {
			       		$("#accepted").fadeOut(1500, null);
			       	});
				}
			});
		}

       $("#resume").fadeOut(500, function() {
				if (pos >= 0) {
					 addRight(allData[pos]["key"]);
				}
				setNextImage()
       });

       if(pos >= 0) {
	       $("#check").fadeIn(500, function() {
	       		$("#check").fadeOut(500, null);
	       });
	   }

   }

}

function fetchAllKeys() {
	var ref = firebase.database().ref("users");
	ref.orderByChild("timestamp").once('value').then(function(snapshot) {
		snapshot.forEach(function(childSnap) {
			v = childSnap.val();
			if(v.display)
				allData.push({"key": childSnap.key, "value": childSnap.val()})
		});
	});

	pos = -1;


}


function setNextImage() {
	if (pos >= allData.length - 1) {
		document.getElementById("resume").src = "done.jpg";
		++pos;
	}
	else {
		document.getElementById("resume").src = allData[++pos]["value"]["imageName"];
	}
	$("#resume").one("load", function() {
		$("#resume").fadeIn(500, null);
	})
}

function sendAcceptEmail(toEmail) {
	var url = "https://api.sendgrid.com/v3/mail/send";

	data = {
	  "personalizations": [
	    {
	      "to": [
	        {
	          "email": toEmail
	        }
	      ],
	      "subject": "Good News!"
	    }
	  ],
	  "from": {
	    "email": "resumemanager.linkedin@gmail.com"
	  },
	  "content": [
	    {
	      "type": "text/plain",
	      "value": "Congratulations! We would like to schedule an interview with you!"
	    }
	  ]
	};

	$.ajax({
	  url:url,
	  type:"POST",
	  data:JSON.stringify(data),
	  contentType:"application/json; charset=utf-8",
	  dataType:"json",
	  beforeSend: function(xhr) {
	  	// xhr.setRequestHeader("Content-Type", "application/json");
	  	xhr.setRequestHeader("Authorization", "BEARER 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");
	  },
	  success: function(){
	    alert("done!");
	  }
	})
}

function sendRejectEmail(toEmail) {
	var url = "https://api.sendgrid.com/v3/mail/send";

	data = {
	  "personalizations": [
	    {
	      "to": [
	        {
	          "email": toEmail
	        }
	      ],
	      "subject": "Your Application Status"
	    }
	  ],
	  "from": {
	    "email": "resumemanager.linkedin@gmail.com"
	  },
	  "content": [
	    {
	      "type": "text/plain",
	      "value": "Sorry, we received many highly qualified applicants this year, and could not find a position for you."
	    }
	  ]
	};

	$.ajax({
	  url:url,
	  type:"POST",
	  data:JSON.stringify(data),
	  contentType:"application/json; charset=utf-8",
	  dataType:"json",
	  beforeSend: function(xhr) {
	  	// xhr.setRequestHeader("Content-Type", "application/json");
	  	xhr.setRequestHeader("Authorization", "BEARER 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");
	  },
	  success: function(){
	    alert("done!");
	  }
	})
}
