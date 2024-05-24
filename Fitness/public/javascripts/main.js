let workoutArray = JSON.parse(localStorage.getItem("workoutArray")) || [];
let mealArray = JSON.parse(localStorage.getItem("mealArray")) || [];

let workoutObject = function (exerciseName, sets, reps, day) {
    this.exerciseName = exerciseName;
    this.sets = sets;
    this.reps = reps;
    this.day = day;
    this.ID = workoutArray.length + 1; // Add unique ID
};

let mealObject = function (mealName, calories, carbs, fats, protein, day) {
    this.mealName = mealName;
    this.calories = calories;
    this.carbs = carbs;
    this.fats = fats;
    this.protein = protein;
    this.day = day;
    this.ID = mealArray.length + 1; // Unique ID for meal
};

// Initial data population
if (workoutArray.length === 0) {
    workoutArray.push(new workoutObject("Squat", 3, 12, "Saturday"));
    workoutArray.push(new workoutObject("Bench Press", 3, 12, "Saturday"));
    workoutArray.push(new workoutObject("Lat Pulldown", 3, 8, "Sunday"));
    localStorage.setItem("workoutArray", JSON.stringify(workoutArray));
}

if (mealArray.length === 0) {
    mealArray.push(new mealObject("Pizza", 300, 20, 50, 10, "Monday"));
    localStorage.setItem("mealArray", JSON.stringify(mealArray));
}




let selectWorkoutDay = "Monday";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    $("#logmeal").page().trigger('pagecreate');
    $(document).on("pageshow", "#logmeal", function() {
        console.log("Log Meal page is now visible");
    });
    


    // Workout related code
    document.getElementById("buttonWorkoutAdd").addEventListener("click", function () {
        workoutArray.push(new workoutObject(
            document.getElementById("exerciseName").value,
            document.getElementById("sets").value,
            document.getElementById("reps").value,
            selectWorkoutDay
        ));
        localStorage.setItem("workoutArray", JSON.stringify(workoutArray));
        document.location.href = "#checkprogress";
    });

    document.getElementById("buttonWorkoutClear").addEventListener("click", function () {
        document.getElementById("exerciseName").value = "";
        document.getElementById("sets").value = "";
        document.getElementById("reps").value = "";
    });

    document.addEventListener("change", function (event) {
        if (event.target.id === 'select-day-workout') {
            selectWorkoutDay = event.target.value;
        }
    });

    // Meal creation related code
    document.getElementById("buttonMealAdd").addEventListener("click", function() {
        mealArray.push(new mealObject(
            document.getElementById("mealName").value,
            document.getElementById("calories").value,
            document.getElementById("carbs").value,
            document.getElementById("fats").value,
            document.getElementById("protein").value,
            selectWorkoutDay
        ));
        localStorage.setItem("mealArray", JSON.stringify(mealArray));
        document.location.href = "#checkprogress";
    });

    document.getElementById("buttonMealClear").addEventListener("click", function () {
        document.getElementById("mealName").value = "";
        document.getElementById("calories").value = "";
        document.getElementById("carbs").value = "";
        document.getElementById("fats").value = "";
        document.getElementById("protein").value = "";
    });

    // Page Before Show code
    $(document).on("pagebeforeshow", "#checkprogress", function () {
        createWorkoutTable();
        createMealTable();
    });

    $(document).on("pagebeforeshow", '#workoutdetails', function() {
        let exerciseID = localStorage.getItem("parm-workout");
        let workoutPointer = getObjectPointer(workoutArray, exerciseID);

        if (workoutPointer !== -1) {
            document.getElementById("exercise").innerHTML = "Exercise ID: " + exerciseID;
            document.getElementById("exerciseNameID").innerHTML = "Exercise Name: " + workoutArray[workoutPointer].exerciseName;
            document.getElementById("setsID").innerHTML = "Number of sets: " + workoutArray[workoutPointer].sets;
            document.getElementById("repsID").innerHTML = "Number of reps: " + workoutArray[workoutPointer].reps;
        }
    });


   
    $(document).on("pagebeforeshow", "#mealdetails", function() {
        let mealID = localStorage.getItem("parm-meal");
        let mealPointer = getObjectPointer(mealArray, mealID);

        if (mealPointer !== -1) {
            document.getElementById("meal").innerHTML = "Meal ID: " + mealID;
            document.getElementById("mealNameID").innerHTML = "Meal Name: " + mealArray[mealPointer].mealName;
            document.getElementById("caloriesID").innerHTML = "Calories: " + mealArray[mealPointer].calories;
            document.getElementById("carbsID").innerHTML = "Carbs: " + mealArray[mealPointer].carbs;
            document.getElementById("fatsID").innerHTML = "Fats: " + mealArray[mealPointer].fats;
            document.getElementById("proteinID").innerHTML = "Protein: " + mealArray[mealPointer].protein;
        }
    });
});

function getObjectPointer(array, ID) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].ID == ID) {
            return i;
        }
    }
    return -1; // Return -1 if not found
}

function createMealTable() {
    let mealTableBody = document.getElementById("mealTable").getElementsByTagName('tbody')[0];
    mealTableBody.innerHTML = "";

    mealArray.forEach(function(meal) {
        let mealRow = document.createElement("tr");
        mealRow.classList.add("onemeal");
        mealRow.setAttribute("data-parm-meal", meal.ID);

        let mealNameCell = document.createElement("td");
        mealNameCell.textContent = meal.mealName;
        mealRow.appendChild(mealNameCell);

        let caloriesCell = document.createElement("td");
        caloriesCell.textContent = meal.calories;
        mealRow.appendChild(caloriesCell);

        let carbsCell = document.createElement("td");
        carbsCell.textContent = meal.carbs;
        mealRow.appendChild(carbsCell);

        let fatsCell = document.createElement("td");
        fatsCell.textContent = meal.fats;
        mealRow.appendChild(fatsCell);

        let proteinCell = document.createElement("td");
        proteinCell.textContent = meal.protein;
        mealRow.appendChild(proteinCell);

        mealTableBody.appendChild(mealRow);
    });

    let mealRows = document.getElementsByClassName("onemeal");
    Array.from(mealRows).forEach(function (mealRow) {
        mealRow.addEventListener("click", function () {
            let mealID = this.getAttribute("data-parm-meal");
            localStorage.setItem("parm-meal", mealID);
            document.location.href = "#mealdetails";
        });
    });
}



function createWorkoutTable() {
    let workoutTableBody = document.getElementById("workoutTable").getElementsByTagName('tbody')[0];
    workoutTableBody.innerHTML = "";

    workoutArray.forEach(function (workout) {
        let workoutRow = document.createElement("tr");
        workoutRow.classList.add("oneworkout");
        workoutRow.setAttribute("data-parm-workout", workout.ID);

        let workoutNameCell = document.createElement("td");
        workoutNameCell.textContent = workout.exerciseName;
        workoutRow.appendChild(workoutNameCell);

        let setsCell = document.createElement("td");
        setsCell.textContent = workout.sets;
        workoutRow.appendChild(setsCell);

        let repsCell = document.createElement("td");
        repsCell.textContent = workout.reps;
        workoutRow.appendChild(repsCell);

        workoutTableBody.appendChild(workoutRow);
    });

    let workoutRows = document.getElementsByClassName("oneworkout");
    Array.from(workoutRows).forEach(function (workoutRow) {
        workoutRow.addEventListener("click", function () {
            let workoutID = this.getAttribute("data-parm-workout");
            localStorage.setItem("parm-workout", workoutID);
            document.location.href = "#workoutdetails";
        });
    });
}
