var db = firebase.database()
function addLeft(user) {
  db.ref("users/" + user + "/leftSwipe").transaction(function(currSwipe) {
    console.log("Incrementing left")
    return ++currSwipe;
  })
}
function addRight(user) {
  db.ref("users/" + user + "/rightSwipe").transaction(function(currSwipe) {
    console.log("Incrementing rightSwipe")
    return ++currSwipe;
  })
}

function getLeft(user, cb) {
	db.ref("users/" + user + "/leftSwipe").once('value', function(snap) {
		cb(snap.val());
	});
}

function getRight(user, cb) {
  db.ref("users/" + user + "/rightSwipe").once('value', function(snap) {
    cb(snap.val());
  });
}


function disable(user) {
  db.ref("users/" + user + "/display").transaction(function(curDisplay) {
    return false;
  })
}