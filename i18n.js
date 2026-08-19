/* ==========================================================================
   Habitly — i18n
   Owner: Core / Infra Lead — Ahmed Ibrahim Shaaban
   -----------------------------------------------------------------------
   Elements marked data-i18n="key" get their text swapped between English
   and Arabic. The chosen language is saved in localStorage, so it stays
   the same when moving between pages. Adding a new translatable string
   on your own page: add the key to both DICTIONARY.en and DICTIONARY.ar
   below, then set data-i18n="that.key" on the element.
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'habitly-lang';

  const DICTIONARY = {
    en: {
      'nav.dashboard': 'Dashboard',
      'nav.habits': 'My Habits',
      'nav.stats': 'Statistics',
      'nav.settings': 'Settings',
      'lang.toggle': 'العربية',

      'hero.eyebrow': 'A quiet way to keep the ledger',
      'hero.title': 'Habits, kept like a ledger — not a scoreboard.',
      'hero.lede': "Habitly trades streak-shaming for something calmer: a daily record you actually want to open. Mark what's done, watch a streak build one tally at a time, and see the shape of your month without the noise.",
      'hero.cta.primary': 'Open Dashboard',
      'hero.cta.secondary': 'View My Habits',
      'hero.panel.eyebrow': 'Today',
      'hero.panel.done': '2 of 6 done',
      'hero.panel.left': '4 habits left today',
      'hero.sample.name': 'Read a Book',
      'hero.sample.streak': '21d streak',

      'menu.title': 'Open a page',
      'menu.count': '4 sections',
      'menu.card1.tag': 'Overview',
      'menu.card1.title': 'Dashboard',
      'menu.card1.desc': "Today's completion, this week at a glance, and what's recommended next.",
      'menu.card2.tag': 'Manage',
      'menu.card2.title': 'My Habits',
      'menu.card2.desc': 'Every habit, filterable by category, with streaks and quick edits.',
      'menu.card3.tag': 'Review',
      'menu.card3.title': 'Statistics',
      'menu.card3.desc': 'Daily streak leaderboard and the full weekly habit log.',
      'menu.card4.tag': 'Configure',
      'menu.card4.title': 'Settings',
      'menu.card4.desc': 'Theme, export or import your data, and habit recommendations.',
      'menu.owner': 'Owner — {name}',

      'footer.tagline': 'Habitly — built by the team, one page at a time.',
      'footer.credit': 'Shell, tokens & data layer — Core / Infra Lead — {coreLead}',

      'placeholder.notBuilt': '{page} page — not built yet',
      'placeholder.instructions': "The shell, nav, tokens, and data layer are ready. Build this page's markup in {html}, its styles in {css}, and its behavior in {js} — read from window.HabitlyData rather than hardcoding numbers.",
    },
    ar: {
      'nav.dashboard': 'لوحة التحكم',
      'nav.habits': 'عاداتي',
      'nav.stats': 'الإحصائيات',
      'nav.settings': 'الإعدادات',
      'lang.toggle': 'EN',

      'hero.eyebrow': 'طريقة هادئة لمتابعة سجلك اليومي',
      'hero.title': 'عاداتك، مسجّلة كأنها دفتر يومياتك — مش لوحة نقاط.',
      'hero.lede': 'هابيتلي بيستبدل ضغط السلسلة المتتالية بحاجة أهدأ: سجل يومي فعلاً بتحب تفتحه. حدد اللي خلصته، وشوف السلسلة بتتكوّن علامة ورا علامة، واتفرج على شكل شهرك من غير أي ضوضاء.',
      'hero.cta.primary': 'افتح لوحة التحكم',
      'hero.cta.secondary': 'شوف عاداتي',
      'hero.panel.eyebrow': 'النهاردة',
      'hero.panel.done': 'خلصت 2 من 6',
      'hero.panel.left': 'باقي 4 عادات النهاردة',
      'hero.sample.name': 'قراءة كتاب',
      'hero.sample.streak': 'سلسلة 21 يوم',

      'menu.title': 'افتح صفحة',
      'menu.count': '4 أقسام',
      'menu.card1.tag': 'نظرة عامة',
      'menu.card1.title': 'لوحة التحكم',
      'menu.card1.desc': 'إنجاز النهاردة، الأسبوع في لمحة، واللي متوصى بيه بعد كده.',
      'menu.card2.tag': 'إدارة',
      'menu.card2.title': 'عاداتي',
      'menu.card2.desc': 'كل عادة، بتقدر تفلترها حسب الفئة، مع السلاسل والتعديل السريع.',
      'menu.card3.tag': 'مراجعة',
      'menu.card3.title': 'الإحصائيات',
      'menu.card3.desc': 'ترتيب أطول السلاسل اليومية وسجل العادات الأسبوعي كامل.',
      'menu.card4.tag': 'إعداد',
      'menu.card4.title': 'الإعدادات',
      'menu.card4.desc': 'الثيم، تصدير أو استيراد بياناتك، وتوصيات العادات.',
      'menu.owner': 'المسؤول — {name}',

      'footer.tagline': 'هابيتلي — بناه الفريق، صفحة بصفحة.',
      'footer.credit': 'الهيكل والـ tokens وطبقة البيانات — Core / Infra Lead — {coreLead}',

      'placeholder.notBuilt': 'صفحة {page} — لسه مش متعملة',
      'placeholder.instructions': 'الهيكل والتنقل والـ tokens وطبقة البيانات جاهزين. ابنِ محتوى الصفحة في {html}، والتنسيق في {css}، والسلوك في {js} — واقرأ البيانات من window.HabitlyData بدل ما تكتب أرقام يدوي.',
    },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    const dict = DICTIONARY[lang] || DICTIONARY.en;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      let text = dict[key];
      if (text === undefined) return;
      // Allow simple {token} substitution from a data-i18n-vars="token:value|token2:value2" attribute
      const varsAttr = el.getAttribute('data-i18n-vars');
      if (varsAttr) {
        varsAttr.split('|').forEach((pair) => {
          const [token, value] = pair.split(':');
          text = text.replace(`{${token}}`, value);
        });
      }
      el.textContent = text;
    });

    const toggleBtn = document.querySelector('.lang-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = dict['lang.toggle'];
      toggleBtn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل للعربي');
    }
  }

  function initToggle() {
    const btn = document.querySelector('.lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      setLang(getLang() === 'ar' ? 'en' : 'ar');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLang());
    initToggle();
  });

  window.HabitlyI18n = { getLang, setLang, applyLang };
})();
