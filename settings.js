/* ==========================================================================
   Habitly — Settings page logic
   Owner: Manal Ezzat Ahmed Gad
   -----------------------------------------------------------------------
  * settings.js
 * Reads mock data from window.HabitlyData (read-only — no setters exist
 * there yet). Everything that needs to persist on this page — profile
 * (name/avatar), theme, dismissed suggestions, backup/restore — is
 * handled locally with its own localStorage keys, since data.js doesn't
 * own any of that.
   ========================================================================== */

(function () {
  'use strict';

  const Data = window.HabitlyData || {};
  const STORAGE = {
    THEME: 'habitly-theme',
    PROFILE: 'habitly-profile',
    DISMISSED_RECS: 'habitly-dismissed-recs',
  };

  const DEFAULT_PROFILE = { name: '', avatar: '🙂' };

  /* ===================== Profile ===================== */
  const avatarDisplay = document.getElementById('avatarDisplay');
  const avatarOptions = document.getElementById('avatarOptions');
  const nameInput = document.getElementById('nameInput');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const saveStatus = document.getElementById('saveStatus');
  const statHabits = document.getElementById('statHabits');
  const statStreak = document.getElementById('statStreak');
  const statStreakLabel = document.getElementById('statStreakLabel');

  let selectedAvatar = DEFAULT_PROFILE.avatar;

  function getProfile() {
    try {
      return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(STORAGE.PROFILE)) };
    } catch (e) {
      return { ...DEFAULT_PROFILE };
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(STORAGE.PROFILE, JSON.stringify(profile));
  }

  function renderProfile() {
    const profile = getProfile();
    selectedAvatar = profile.avatar;
    if (avatarDisplay) avatarDisplay.textContent = profile.avatar;
    if (nameInput) nameInput.value = profile.name;

    if (avatarOptions) {
      [...avatarOptions.children].forEach((btn) => {
        btn.classList.toggle('is-selected', btn.dataset.avatar === profile.avatar);
      });
    }
  }

  function renderProfileStats() {
    const habits = Data.getHabits ? Data.getHabits() : [];
    const longest = Data.getLongestStreakHabit ? Data.getLongestStreakHabit() : null;

    if (statHabits) statHabits.textContent = habits.length;
    if (statStreak) statStreak.textContent = longest ? longest.streak : 0;
    if (statStreakLabel && longest) {
      statStreakLabel.textContent = `Longest Streak · ${longest.name}`;
    }
  }

  avatarOptions?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    selectedAvatar = btn.dataset.avatar;
    avatarDisplay.textContent = selectedAvatar;
    [...avatarOptions.children].forEach((b) => b.classList.toggle('is-selected', b === btn));
  });

  saveProfileBtn?.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      saveStatus.textContent = 'Name is required.';
      saveStatus.classList.add('is-error');
      return;
    }
    saveProfile({ name, avatar: selectedAvatar });
    saveStatus.textContent = 'Saved ✓';
    saveStatus.classList.remove('is-error');
    setTimeout(() => (saveStatus.textContent = ''), 2500);
  });

  renderProfile();
  renderProfileStats();

  /* ===================== Theme ===================== */
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('theme-light', theme === 'light');
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE.THEME) || 'dark';
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = themeToggle.getAttribute('aria-pressed') === 'true';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE.THEME, next);
  });

  applyTheme(getSavedTheme());

  /* ===================== Export ===================== */
  const exportBtn = document.getElementById('exportBtn');
  const importInput = document.getElementById('importInput');
  const dataStatus = document.getElementById('dataStatus');

  function showStatus(message, isError) {
    dataStatus.textContent = message;
    dataStatus.classList.toggle('is-error', !!isError);
  }

  exportBtn?.addEventListener('click', () => {
    try {
      const snapshot = {
        profile: getProfile(),
        habits: Data.getHabits ? Data.getHabits() : [],
        categories: Data.getCategories ? Data.getCategories() : [],
        recommendations: Data.getRecommendations ? Data.getRecommendations() : [],
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habitly-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus('Snapshot exported.', false);
    } catch (err) {
      showStatus('Something went wrong while exporting.', true);
    }
  });

  /* ===================== Import ===================== */
  importInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        // Profile is the one piece we CAN actually restore locally.
        if (parsed.profile) {
          saveProfile({ ...DEFAULT_PROFILE, ...parsed.profile });
          renderProfile();
        }
        showStatus('Profile restored. Habit data can\u2019t be imported yet \u2014 the data layer doesn\u2019t support it.', false);
      } catch (err) {
        showStatus('That file isn\u2019t valid JSON.', true);
      }
    };
    reader.readAsText(file);
    importInput.value = '';
  });

  /* ===================== Reset local preferences ===================== */
  const resetBtn = document.getElementById('resetBtn');
  const confirmModal = document.getElementById('confirmModal');
  const cancelReset = document.getElementById('cancelReset');
  const confirmReset = document.getElementById('confirmReset');

  resetBtn?.addEventListener('click', () => {
    confirmModal.hidden = false;
  });

  cancelReset?.addEventListener('click', () => {
    confirmModal.hidden = true;
  });

  confirmModal?.addEventListener('click', (e) => {
    if (e.target === confirmModal) confirmModal.hidden = true;
  });

  confirmReset?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE.THEME);
    localStorage.removeItem(STORAGE.PROFILE);
    localStorage.removeItem(STORAGE.DISMISSED_RECS);
    applyTheme('dark');
    renderProfile();
    confirmModal.hidden = true;
    showStatus('Local preferences reset.', false);
  });
})();