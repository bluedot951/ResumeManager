var db = firebase.database()
function addLeft(user) {
  db.ref(user).child("leftSwipe").transaction(function(currSwipe) {
    console.log("Incremeneting left")
    return ++currSwipe;
  })
}
