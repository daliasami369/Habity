/* ==========================================================================
   Habitly — Dashboard page logic
   Owner: Dalia Samy Abdelaziz
   -----------------------------------------------------------------------
   Read data via window.HabitlyData (see js/data.js for the full API —
   getHabits, getTodayCompletion, getWeekTotals, getCategoryBreakdown, etc).
   Need a new field or helper? Ask the Core Lead rather than editing data.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // TODO(Dalia Samy Abdelaziz): build this page.
});
function complete(){
var habitcircle=document.getElementsByClassName("habit");
var completed=document.getElementsByClassName("completed-list")[0];
for(var i=0;i<habitcircle.length;i++)
{
    habitcircle[i].onclick=function()
    {
        var task = this.parentElement;
           completed.appendChild(task);
            // task.style.display = "none";
    }
}
}
complete();
/* ===================== Recommendations ===================== */
(function () {
  const Data = window.HabitlyData || {};
  const STORAGE_KEY = 'habitly-added-recs';

  const recsList = document.getElementById('recsList');
  if (!recsList) return;

 
  const COLOR_CYCLE = ['blue', 'green', 'pink', 'purple'];
  const ICON_BY_CATEGORY = {
    mind: 'fa-book',
    body: 'fa-dumbbell',
    health: 'fa-droplet',
    wellness: 'fa-spa',
  };

  function getAdded() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function toggleAdded(id) {
    const added = getAdded();
    const idx = added.indexOf(id);
    if (idx === -1) added.push(id);
    else added.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(added));
    return added.includes(id);
  }

  function renderRecommendations() {
    const all = Data.getRecommendations ? Data.getRecommendations() : [];
    const added = getAdded();

    if (!all.length) {
      recsList.innerHTML = `<p class="recs-empty">No suggestions right now.</p>`;
      return;
    }

    recsList.innerHTML = all.map((rec, i) => {
      const color = COLOR_CYCLE[i % COLOR_CYCLE.length];
      const icon = ICON_BY_CATEGORY[rec.category] || 'fa-star';
      const isAdded = added.includes(rec.id);
      return `
        <div class="tasks">
          <div class="task-info">
            <div class="task-icon ${color}-icon">
              <i class="fa-solid ${icon}"></i>
            </div>
            <div>
              <h4>${rec.name}</h4>
              <h5>${rec.reason || ''}${rec.unitLabel ? ' · ' + rec.unitLabel : ''}</h5>
            </div>
          </div>
          <div
            class="rec-toggle habit-circle ${color} ${isAdded ? 'rec-toggle--added' : ''}"
            data-rec-id="${rec.id}"
            role="button"
            tabindex="0"
            aria-pressed="${isAdded}"
            aria-label="Add ${rec.name}"
          ></div>
        </div>
      `;
    }).join('');

    recsList.querySelectorAll('.rec-toggle').forEach((el) => {
      el.addEventListener('click', () => {
        const isAdded = toggleAdded(el.dataset.recId);
        el.classList.toggle('rec-toggle--added', isAdded);
        el.setAttribute('aria-pressed', String(isAdded));
      });
    });
  }

  renderRecommendations();
})();