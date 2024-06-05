var express = require('express');
var router = express.Router();


let workoutServerArray = []
let mealServerArray = []

let workoutServerObject = function (exerciseName, sets, reps, day) {
    this.exerciseName = exerciseName;
    this.sets = sets;
    this.reps = reps;
    this.day = day;
    this.ID = Date.now() // Add unique ID
};



let mealServerObject = function (mealName, calories, carbs, fats, protein, day) {
    this.mealName = mealName;
    this.calories = calories;
    this.carbs = carbs;
    this.fats = fats;
    this.protein = protein;
    this.day = day;
    this.ID = Date.now() +1; // Unique ID for meal
};



// Initial data population

    workoutServerArray.push(new workoutServerObject("Squat", 3, 12, "Saturday"));
    workoutServerArray.push(new workoutServerObject("Bench Press", 3, 12, "Saturday"));
    workoutServerArray.push(new workoutServerObject("Lat Pulldown", 3, 8, "Sunday"));



    mealServerArray.push(new mealServerObject("Pizza", 300, 20, 50, 10, "Monday"));



    
function getObjectPointer(array, ID) {
  for (let i = 0; i < array.length; i++) {
      if (array[i].ID == ID) {
          return i;
      }
  }
  return -1; // Return -1 if not found
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/getMeals', function(req, res) {
  res.status(200).json(mealServerArray);
})


router.get("/getWorkouts", function(req, res) {
  res.status(200).json(workoutServerArray)
})

router.post('/addMeal', function(req, res){
  const newMeal = req.body;
  mealServerArray.push(newMeal);
  res.status(200).json(newMeal);
})

router.post("/addWorkout", function(req, res){
  const newWorkout = req.body;
  workoutServerArray.push(newWorkout);
  res.status(200).json(newWorkout)
})

router.delete("/deleteMeal/:ID", function(req, res) {
  const mealDelID = req.params.ID;
  let mealPointer = getObjectPointer(mealServerArray, mealDelID);
  console.log(mealPointer)
  if (mealPointer  === -1) {
    console.log("Not found");
    return res.status(500).json({
      status: "error - no such ID for this"
    })
  }
  else{
    mealServerArray.splice(mealPointer, 1);
    res.send("Meal with ID " + mealDelID + " has been deleted.")
  }
})



router.delete("/deleteWorkout/:ID", function(req, res) {
  
  const workoutDelID = req.params.ID;
  let workoutPointer = getObjectPointer(workoutServerArray, workoutDelID);
  console.log(workoutServerArray)
  console.log(workoutPointer)
  if (workoutPointer  === -1) {
    console.log("Not found");
    return res.status(500).json({
      status: "error - no such ID for this"
    })
  }
  else{
    workoutServerArray.splice(workoutPointer, 1);
    res.send("Workout with ID " + workoutDelID + " has been deleted.")
  }
})


module.exports = router;
