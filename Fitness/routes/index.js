var express = require('express');
var router = express.Router();
var fs = require("fs");

// Server data arrays
let workoutServerArray = [];
let mealServerArray = [];

// File manager for reading and writing data
let fileManagerWorkout = {
    read: function() {
        var rawdata = fs.readFileSync('objectdataworkout.json');
        let goodData = JSON.parse(rawdata);
        workoutServerArray = goodData;
    },
    write: function() {
        let data = JSON.stringify(workoutServerArray);
        fs.writeFileSync('objectdataworkout.json', data);
    },
    validData: function() {
        var rawdata = fs.readFileSync('objectdataworkout.json');
        console.log(rawdata.length);
        return rawdata.length > 0;
    }
};

let fileManagerMeal = {
  read: function() {
      var rawdata = fs.readFileSync('objectdatameal.json');
      let goodData = JSON.parse(rawdata);
      mealServerArray = goodData;
  },
  write: function() {
      let data = JSON.stringify(mealServerArray);
      fs.writeFileSync('objectdatameal.json', data);
  },
  validData: function() {
      var rawdata = fs.readFileSync('objectdatameal.json');
      console.log(rawdata.length);
      return rawdata.length > 0;
  }
};


// Server object constructors
let workoutServerObject = function (exerciseName, sets, reps, day) {
    this.exerciseName = exerciseName;
    this.sets = sets;
    this.reps = reps;
    this.day = day;
    this.ID = Date.now(); // Add unique ID
};

let mealServerObject = function (mealName, calories, carbs, fats, protein, day) {
    this.mealName = mealName;
    this.calories = calories;
    this.carbs = carbs;
    this.fats = fats;
    this.protein = protein;
    this.day = day;
    this.ID = Date.now() + 1; // Unique ID for meal
};

// Initial data population



if(!fileManagerWorkout.validData()) {
  workoutServerArray.push(new workoutServerObject("Squat", 3, 12, "Saturday"));

  
  fileManagerWorkout.write();
  }
  else {
  fileManagerWorkout.read(); 
  }


  if (!fileManagerMeal.validData()){
    mealServerArray.push(new mealServerObject("Pizza", 300, 20, 50, 10, "Monday"));

  }
  else {
    fileManagerMeal.read(); 
    }



// Function to find object index by ID
function getObjectPointer(array, ID) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].ID == ID) {
            return i;
        }
    }
    return -1; // Return -1 if not found
}

// Routes
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/getMeals', function(req, res) {
  fileManagerMeal.read()
    res.status(200).json(mealServerArray);

});

router.get("/getWorkouts", function(req, res) {
  fileManagerWorkout.read()
    res.status(200).json(workoutServerArray);
});

router.post('/addMeal', function(req, res) {
    const newMeal = req.body;

    mealServerArray.push(newMeal);
    fileManagerMeal.write();
    res.status(200).json(newMeal);
});

router.post("/addWorkout", function(req, res) {
    const newWorkout = req.body;
    workoutServerArray.push(newWorkout);
    fileManagerWorkout.write()
    res.status(200).json(newWorkout);
});

router.delete("/deleteMeal/:ID", function(req, res) {
    const mealDelID = req.params.ID;
    let mealPointer = getObjectPointer(mealServerArray, mealDelID);
    if (mealPointer === -1) {
        return res.status(500).json({ status: "error - no such ID for this" });
    } else {
        mealServerArray.splice(mealPointer, 1);
        fileManagerMeal.read();
        res.send("Meal with ID " + mealDelID + " has been deleted.");
    }
});

router.delete("/deleteWorkout/:ID", function(req, res) {
    const workoutDelID = req.params.ID;
    let workoutPointer = getObjectPointer(workoutServerArray, workoutDelID);
    if (workoutPointer === -1) {
        return res.status(500).json({ status: "error - no such ID for this" });
    } else {
        workoutServerArray.splice(workoutPointer, 1);
        fileManagerWorkout.read();
        res.send("Workout with ID " + workoutDelID + " has been deleted.");
    }
});

module.exports = router;
