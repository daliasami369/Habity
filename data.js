/* ==========================================================================
   Habitly — Data Layer
   Owner: Core / Infra Lead — Ahmed Ibrahim Shaaban
   -----------------------------------------------------------------------
   Only the Core Lead edits this file. Everyone else reads from
   `window.HabitlyData` — open an issue with the Core Lead if a page
   needs a new field or helper function instead of editing this directly.
   ========================================================================== */

(function () {
  'use strict';

  /** Categories: id, label, and the CSS token that colors it everywhere. */
  const CATEGORIES = [
    { id: 'mind', label: 'Mind', colorVar: '--cat-mind' },
    { id: 'body', label: 'Body', colorVar: '--cat-body' },
    { id: 'health', label: 'Health', colorVar: '--cat-health' },
    { id: 'wellness', label: 'Wellness', colorVar: '--cat-wellness' },
  ];

  /** Mock habits. `log` is the last 7 days, oldest first, true = done. */
  const HABITS = [
    {
      id: 'read-a-book',
      name: 'Read a Book',
      category: 'mind',
      unitLabel: '20 pages',
      streak: 21,
      bestStreak: 21,
      doneToday: false,
      log: [true, true, true, true, true, true, false],
    },
    {
      id: 'morning-study',
      name: 'Morning Study',
      category: 'mind',
      unitLabel: '45 min',
      streak: 14,
      bestStreak: 21,
      doneToday: true,
      log: [true, true, false, true, true, true, true],
    },
    {
      id: 'run-or-workout',
      name: 'Run or Workout',
      category: 'body',
      unitLabel: '30 min',
      streak: 7,
      bestStreak: 12,
      doneToday: true,
      log: [true, false, true, true, true, false, true],
    },
    {
      id: 'drink-water',
      name: 'Drink Water',
      category: 'health',
      unitLabel: '2.5 L',
      streak: 5,
      bestStreak: 30,
      doneToday: false,
      log: [true, true, false, false, true, true, false],
    },
    {
      id: 'meditate',
      name: 'Meditate',
      category: 'wellness',
      unitLabel: '10 min',
      streak: 3,
      bestStreak: 9,
      doneToday: false,
      log: [false, false, true, true, false, true, false],
    },
    {
      id: 'no-screens-after-10pm',
      name: 'No Screens After 10pm',
      category: 'wellness',
      unitLabel: 'daily',
      streak: 9,
      bestStreak: 14,
      doneToday: false,
      log: [true, true, true, false, true, true, false],
    },
  ];

 const RECOMMENDATIONS = [
  { id: 'cold-shower', name: 'Cold Shower', reason: 'Boosts focus & mood', unitLabel: '3 min', category: 'health' },
  { id: 'gratitude-journal', name: 'Gratitude Journal', reason: 'Based on your wellness habits', unitLabel: '5 min', category: 'wellness' },

  
  { id: 'stretch-break', name: 'Stretch Break', reason: 'Loosens up after long sitting', unitLabel: '5 min', category: 'body' },
  { id: 'plan-tomorrow', name: 'Plan Tomorrow', reason: 'Wraps up your day with clarity', unitLabel: '5 min', category: 'mind' },
  { id: 'sunlight-walk', name: 'Sunlight Walk', reason: 'Boosts vitamin D & mood', unitLabel: '15 min', category: 'health' },
];

  const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  function getCategories() {
    return CATEGORIES.slice();
  }

  function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id) || null;
  }

  function getHabits() {
    return HABITS.slice();
  }

  function getHabitById(id) {
    return HABITS.find((h) => h.id === id) || null;
  }

  function getHabitsByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') return getHabits();
    return HABITS.filter((h) => h.category === categoryId);
  }

  function getTodayCompletion() {
    const total = HABITS.length;
    const done = HABITS.filter((h) => h.doneToday).length;
    return {
      done,
      total,
      pct: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }

  function getLongestStreakHabit() {
    return HABITS.slice().sort((a, b) => b.streak - a.streak)[0] || null;
  }

  /** % of the last 7 logged days that were completed, across all habits. */
  function getWeeklyRate() {
    let done = 0;
    let total = 0;
    HABITS.forEach((h) => {
      h.log.forEach((day) => {
        total += 1;
        if (day) done += 1;
      });
    });
    return {
      pct: total === 0 ? 0 : Math.round((done / total) * 100),
      completions: done,
    };
  }

  /** Per-day totals for the current week, keyed to WEEKDAY_LABELS order. */
  function getWeekTotals() {
    return WEEKDAY_LABELS.map((label, i) => {
      const count = HABITS.reduce((sum, h) => sum + (h.log[i] ? 1 : 0), 0);
      return { label, count };
    });
  }

  /** Completion summary grouped by category, e.g. for a "By Category" panel. */
  function getCategoryBreakdown() {
    return CATEGORIES.map((cat) => {
      const habits = getHabitsByCategory(cat.id);
      const done = habits.filter((h) => h.doneToday).length;
      return { ...cat, done, total: habits.length };
    });
  }

  function getRecommendations() {
    return RECOMMENDATIONS.slice();
  }

  /** Formats a streak count consistently everywhere, e.g. formatStreak(21) -> "21d streak" */
  function formatStreak(days) {
    return `${days}d streak`;
  }

  function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function generateId(prefix) {
    return `${prefix || 'id'}-${Math.random().toString(36).slice(2, 9)}`;
  }

  // ---------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------

  window.HabitlyData = {
    WEEKDAY_LABELS,
    getCategories,
    getCategory,
    getHabits,
    getHabitById,
    getHabitsByCategory,
    getTodayCompletion,
    getLongestStreakHabit,
    getWeeklyRate,
    getWeekTotals,
    getCategoryBreakdown,
    getRecommendations,
    formatStreak,
    formatDate,
    generateId,
  };
})();
