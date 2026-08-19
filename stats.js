/* ==========================================================================
   Habitly — Statistics page logic
   Owner: Basmala Hassan Abdallah
   -----------------------------------------------------------------------
   Read data via window.HabitlyData (see js/data.js for the full API —
   getHabits, getTodayCompletion, getWeekTotals, getCategoryBreakdown, etc).
   Need a new field or helper? Ask the Core Lead rather than editing data.js.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const {
    getHabits,
    getWeeklyRate,
  } = window.HabitlyData;

  const habits = getHabits();

  // ================= Daily Streaks =================

  const streakList = document.getElementById("daily-streaks");

  habits
    .slice()
    .sort((a, b) => b.streak - a.streak)
    .forEach((habit, index) => {
      const progress =
        habit.bestStreak === 0
          ? 0
          : Math.round((habit.streak / habit.bestStreak) * 100);

      const row = document.createElement("div");
      row.className = "ledger-row";

      row.innerHTML = `
        <span class="streak-rank">#${index + 1}</span>

        <div
          class="ledger-row__icon"
          style="
            --icon-color: var(--cat-${habit.category});
            --icon-bg: color-mix(
              in srgb,
              var(--cat-${habit.category}) 15%,
              var(--color-bg-elevated)
            );
          "
        >
          <span
            class="cat-dot"
            style="--dot-color: var(--cat-${habit.category});"
          ></span>
        </div>

        <div class="ledger-row__body">
          <div class="ledger-row__title">
            ${habit.name}
          </div>

          <div class="streak-progress">
            <div
              class="streak-progress__bar"
              style="
                width: ${progress}%;
                --progress-color: var(--cat-${habit.category});
              "
            ></div>
          </div>
        </div>

        <div class="streak-value">
          <span class="streak-value__best">
            best ${habit.bestStreak}d
          </span>

          <strong
            style="color: var(--cat-${habit.category});"
          >
            ${habit.streak}d
          </strong>
        </div>
      `;

      streakList.appendChild(row);
    });


  // ================= Weekly Habit Log =================

  const weeklyBody = document.getElementById("weekly-log-body");

  habits.forEach((habit) => {
    const completedDays = habit.log.filter(Boolean).length;

    const rate = Math.round((completedDays / habit.log.length) * 100);

    const row = document.createElement("tr");

    row.innerHTML = `
      <th scope="row">
        <span
          class="cat-dot"
          style="--dot-color: var(--cat-${habit.category});"
        ></span>

        <span>${habit.name}</span>
      </th>

      ${habit.log
        .map(
          (done) => `
            <td>
              <span
                class="check-ring ${done ? "is-done" : ""}"
                style="--ring-color: var(--cat-${habit.category});"
                aria-label="${done ? "Completed" : "Not completed"}"
              >
                ${done ? "✓" : ""}
              </span>
            </td>
          `
        )
        .join("")}

      <td class="weekly-rate">
        ${rate}%
      </td>
    `;

    weeklyBody.appendChild(row);
  });


  // ================= Summary Cards =================

  const weeklyRate = getWeeklyRate();

  // Total check-ins
  const totalCheckins = document.getElementById("total-checkins");
  totalCheckins.textContent = weeklyRate.completions;


  // Average completion
  const avgCompletion = document.getElementById("avg-completion");
  avgCompletion.textContent = `${weeklyRate.pct}%`;


  // Habits on track
  const onTrack = habits.filter((habit) => habit.streak >= 3);

  const habitsOnTrack = document.getElementById("habits-on-track");

  habitsOnTrack.textContent = `${onTrack.length}/${habits.length}`;
});

