let workoutArray = JSON.parse(localStorage.getItem("workoutArray")) || [];
let mealArray = JSON.parse(localStorage.getItem("mealArray")) || [];

let workoutObject = function (exerciseName, sets, reps, day) {
    this.exerciseName = exerciseName;
    this.sets = sets;
    this.reps = reps;
    this.day = day;
    this.ID = Date.now() // Add unique ID
};



let mealObject = function (mealName, calories, carbs, fats, protein, day) {
    this.mealName = mealName;
    this.calories = calories;
    this.carbs = carbs;
    this.fats = fats;
    this.protein = protein;
    this.day = day;
    this.ID = Date.now() +1; // Unique ID for meal
};






document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");


    // Workout related code
    document.getElementById("buttonWorkoutAdd").addEventListener("click", function () {
        let newWorkout = new workoutObject(
            document.getElementById("exerciseName").value,
            document.getElementById("sets").value,
            document.getElementById("reps").value,
            document.getElementById("select-day-workout").value
        );


        $.ajax({
            url: "/addWorkout",
            type: "POST",
            data: JSON.stringify(newWorkout),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function(response) {
                console.log("Workout added successfully:", response);
            },
            error: function(xhr, status, error) {
                console.log("Error adding workout:", xhr.responseText);
            }
        })


        document.location.href = "#checkprogress";
    });

    document.getElementById("buttonWorkoutClear").addEventListener("click", function () {
        document.getElementById("exerciseName").value = "";
        document.getElementById("sets").value = "";
        document.getElementById("reps").value = "";
    });


    document.getElementById("buttonWorkoutDelete").addEventListener("click", function() {
        let workoutID = localStorage.getItem("parm-workout");
        
        deleteWorkout(workoutID)
    })
    

    // Meal creation related code
    document.getElementById("buttonMealAdd").addEventListener("click", function() {
        let newMeal = new mealObject(
            document.getElementById("mealName").value,
            document.getElementById("calories").value,
            document.getElementById("carbs").value,
            document.getElementById("fats").value,
            document.getElementById("protein").value,
            document.getElementById("select-day-meal").value
        );

        $.ajax({
            url: "/addMeal",
            type: "POST",
            data: JSON.stringify(newMeal),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function(response) {
                console.log("Meal added successfully:", response);
            },
            error: function(xhr, status, error) {
                console.log("Error adding meal:", xhr.responseText);
            }
        })

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

    document.getElementById("buttonMealDelete").addEventListener("click", function(){
        let mealID = localStorage.getItem("parm-meal")
        
        
        deleteMeal(mealID);
    })



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
            document.getElementById("mealDayID").innerHTML = "Day: " + mealArray[mealPointer].day;
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
    // Assuming you have meal tables with IDs formatted like 'mealTableMonday', 'mealTableTuesday', etc.
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Clear existing tables first  
    days.forEach(day => {
        let tableId = `mealTable${day}`;
        let mealTableBody = document.getElementById(tableId);
        if (mealTableBody) {
            mealTableBody.innerHTML = "";  // Clear the table for this day
        }
    });


    $.get("/getMeals", function(data, status) {
        console.log(status);
        mealArray = data;



 

    // Now populate the tables with meals
    mealArray.forEach(function(meal) {
        let mealTableBody = document.getElementById(`mealTable${meal.day}`);
        if (!mealTableBody) {
            console.error("No table found for day:", meal.day);
            return; // Skip this meal if its day's table does not exist
        }

        let mealRow = document.createElement("tr");
        mealRow.classList.add("onemeal");
        mealRow.setAttribute("data-parm-meal", meal.ID);

        // Create and append cells for each meal property
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

        // Append the row to the correct table body
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
           
})
}




function createWorkoutTable() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Clear existing tables first
    days.forEach(day => {
        let tableId = `workoutTable${day}`;
        let workoutTableBody = document.getElementById(tableId);
        if (workoutTableBody) {
            workoutTableBody.innerHTML = "";  // Clear the table for this day
        }
    });


    $.get("/getWorkouts", function(data, status) {
        console.log(status);
        workoutArray = data;
    
        // Now populate the tables with workouts
        workoutArray.forEach(function(workout) {
            let workoutTableBody = document.getElementById(`workoutTable${workout.day}`);
    
            if (!workoutTableBody) {
                console.error("No table found for day:", workout.day);
                return; // Skip this workout if its day's table does not exist
            }
    
            let workoutRow = document.createElement("tr");
            workoutRow.classList.add("oneworkout");
            workoutRow.setAttribute("data-parm-workout", workout.ID);
    
            // Create and append cells for each workout property
            let exerciseNameCell = document.createElement("td");
            exerciseNameCell.textContent = workout.exerciseName;
            workoutRow.appendChild(exerciseNameCell);
    
            let setsCell = document.createElement("td");
            setsCell.textContent = workout.sets;
            workoutRow.appendChild(setsCell);
    
            let repsCell = document.createElement("td");
            repsCell.textContent = workout.reps;
            workoutRow.appendChild(repsCell);
    
            // Append the row to the correct table body
            workoutTableBody.appendChild(workoutRow);
        });
    
        let workoutRows = document.getElementsByClassName("oneworkout");
        Array.from(workoutRows).forEach(function(workoutRow) {
            workoutRow.addEventListener("click", function() {
                let workoutID = this.getAttribute("data-parm-workout");
                localStorage.setItem("parm-workout", workoutID);
                document.location.href = "#workoutdetails";
            });
        });
    });
    
}


function deleteMeal(which) {
    $.ajax({
        type: "DELETE",
        url: "/deleteMeal/" + which,
        success: function(result) {
            console.log("Delete was successful")
            document.location.href = "index.html#checkprogress";

        },
        error: function(xhr, textStatus, errorThrown) {
            console.log(textStatus);
            alert("Server Failed to delete")
        }
    })
}


function deleteWorkout(which) {
    $.ajax({
        type: "DELETE",
        url: "/deleteWorkout/" + which,
        success: function(result) {
            console.log("Delete was successful")
            document.location.href = "index.html#checkprogress";

        },
        error: function(xhr, textStatus, errorThrown) {
            console.log(textStatus);
            alert("Server Failed to delete")
        }
    })
}