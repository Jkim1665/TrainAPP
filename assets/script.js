// Initialize Firebase
var config = {
    apiKey: "AIzaSyCxbsmO2tcnUJmOLflj1EFoWScmJGbL49o",
    authDomain: "fir-walex.firebaseapp.com",
    databaseURL: "https://fir-walex.firebaseio.com",
    projectId: "fir-walex",
    storageBucket: "fir-walex.appspot.com",
    messagingSenderId: "605361847445"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function () {
    event.preventDefault();

    //hold user input 
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstTrainInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    //need to create an object to retrieve the train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    //Upload train data to firebase
    database.ref().push(newTrain);

     // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  // Determine when the next train arrives.
  return false;
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {


    //if u dont add the val(), === error
    console.log(childSnapshot.val());

    //need to store the child's info in new variable names. 
    var newName = childSnapshot.val().name;
    var newDestination = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFrequency = childSnapshot.val().frequency;
   
    var timeArray = newFirstTrain.split(":");
    var trainMTime = moment().hours(timeArray[0].minutes(timeArray[1]));
    var maxMoment = moment.max(moment(), trainMTime);
    var minutesAway;
    var arrivalTime;
    
    if (maxMoment === trainMTime) {
        arrivalTime = trainMTime.format("hh:mm A");
        minutesAway = trainMTime.diff(moment(), "minutes");
    } else {
        //minutes until arrival
        var differenceInTimes = moment().diff(trainMTime, "minutes");
        var remainderInTime = differenceInTimes % newFrequency;
        minutesAway = newFrequency - remainderInTime;
        //calculate the arrival Time
        arrivalTime = moment().add(minutesAway, "m").format("hh:mm A");
    }

    //append into the form
    $("#trainTable > tbody").append("<tr><td>" + newName + "</td><td>" + newDestination + "</td><td>" +
    newFrequency + "</td><td>" + minutesAway + "</td><td>" + tMinutes + "</td></tr>")
});


