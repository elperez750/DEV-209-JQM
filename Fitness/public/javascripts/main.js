let workoutArray = []
let mealArray = []



let workoutObject = function(exersiceName, sets, reps, day) {
    this.exersiceName = exersiceName
    this.sets = sets
    this.reps = reps
    this.day = day
}



let mealObject = function(mealName, calories, carbs, fats, protein, day) {
    this.mealName = mealName
    this.calories = calories
    this.carbs = carbs
    this.fats = fats
    this.protein = protein
    this.day = day
    this.ID = mealArray.length + 1
}


workoutArray.push(new workoutObject("Squat", 3, 12, "Saturday"))
workoutArray.push(new workoutObject("Bench Press", 3, 12, "Saturday"))
workoutArray.push(new workoutObject("Lat Pulldown", 3, 8, "Sunday"))


mealArray.push(new mealObject("Pizza", 300, 20, 50, 10, "Monday"))

let selectWorkoutDay = "Monday"
document.addEventListener("DOMContentLoaded", function(event){

    document.getElementById("buttonWorkoutAdd").addEventListener("click", function(){
        workoutArray.push(new workoutObject(document.getElementById("exerciseName").value, document.getElementById("sets").value, document.getElementById("reps").value, selectWorkoutDay ))
        document.location.href = "index.html#checkprogress"
    })


  


    
    
    document.getElementById("buttonWorkoutClear").addEventListener("click", function(){
        document.getElementById("exerciseName").value = "";
        document.getElementById("sets").value = "";
        document.getElementById("reps").value = "";
        console.log("clear was done")
        
    })

document.addEventListener("change", function(event){
    if (event.target.id === 'select-day-workout') {
        selectWorkoutDay = event.target.value
    }
})


$(document).on("pagebeforeshow", "#checkprogress", function(event){
    createWorkoutList();
})

    })

function createWorkoutList(){
    let theList = document.getElementById("myul");
    theList.innerHTML = "";


    workoutArray.forEach(function(element){
        let li = document.createElement("li");
        li.innerHTML = element.ID + ": " + element.exersiceName + element.sets + element.reps;
        theList.appendChild(li);
    })
    }


