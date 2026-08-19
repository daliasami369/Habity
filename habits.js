/* ==========================================================================
   Habitly — Habits page logic
   Owner: Nahla Yasser Arafat Abdelhay
   -----------------------------------------------------------------------
   Read data via window.HabitlyData (see js/data.js for the full API —
   getHabits, getTodayCompletion, getWeekTotals, getCategoryBreakdown, etc).
   Need a new field or helper? Ask the Core Lead rather than editing data.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // TODO(Nahla Yasser Arafat Abdelhay): build this page.
});

var buttons = document.querySelectorAll(".check");
var ongoing = document.getElementById("ongoing");
var completed = document.getElementById("completed");
var counter = document.getElementById("counter");

buttons.forEach(function (button) {
  button.onclick = function () {
    var habit = button.parentElement;

    if (habit.parentElement === ongoing) {
      completed.appendChild(habit);
      habit.classList.add("done");
      button.textContent = "✓";
    } else {
      ongoing.appendChild(habit);
      habit.classList.remove("done");
      button.textContent = "";
    }

    counter.textContent =
      completed.children.length +
      " of " +
      (ongoing.children.length + completed.children.length) +
      " completed today";
  };
});