const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navBackdrop = document.querySelector('.nav-backdrop');
const pageBody = document.body;
const currentYearSpan = document.querySelector('[data-current-year]');
const contactForm = document.querySelector('[data-contact-form]');
const contactFeedback = document.querySelector('[data-contact-feedback]');
const newsletterForm = document.querySelector('[data-newsletter-form]');
const newsletterFeedback = document.querySelector('[data-newsletter-feedback]');
const spotlightTabs = document.querySelectorAll('[data-spotlight-target]');
const spotlightPanels = document.querySelectorAll('[data-spotlight-panel]');
const desktopNav = window.matchMedia('(min-width: 961px)');

if (navBackdrop) {
  navBackdrop.setAttribute('aria-hidden', 'true');
}

function setNavState(isOpen) {
  if (!nav || !navToggle || !navList) return;

  nav.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));

  const shouldHideList = !desktopNav.matches && !isOpen;
  navList.setAttribute('aria-hidden', String(shouldHideList));

  const shouldHideBackdrop = !isOpen || desktopNav.matches;
  navBackdrop?.setAttribute('aria-hidden', String(shouldHideBackdrop));

  if (!desktopNav.matches) {
    pageBody?.classList.toggle('is-nav-open', isOpen);
  } else {
    pageBody?.classList.remove('is-nav-open');
  }
}

function openNav() {
  if (!nav || !navToggle || !navList) return;
  if (desktopNav.matches) return;

  setNavState(true);
  const firstLink = navList.querySelector('a');
  firstLink?.focus({ preventScroll: true });
}

function closeNav({ returnFocus = false } = {}) {
  if (!nav || !navToggle || !navList) return;
  if (!nav.classList.contains('is-open')) return;

  setNavState(false);
  if (returnFocus) {
    navToggle.focus();
  }
}

function setHeaderState() {
  if (!header) return;
  const shouldCondense = window.scrollY > 16;
  header.classList.toggle('is-condensed', shouldCondense);
}

function syncNav(mediaQuery) {
  if (!nav || !navToggle || !navList) return;
  if (mediaQuery.matches) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navList.setAttribute('aria-hidden', 'false');
    navBackdrop?.setAttribute('aria-hidden', 'true');
    pageBody?.classList.remove('is-nav-open');
  } else {
    setNavState(nav.classList.contains('is-open'));
  }
}

setHeaderState();
syncNav(desktopNav);

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(setHeaderState);
});

desktopNav.addEventListener('change', () => syncNav(desktopNav));

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });
}

if (navList && navToggle) {
  navList.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    if (!desktopNav.matches) {
      closeNav();
    }
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', () => {
    closeNav({ returnFocus: true });
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !desktopNav.matches) {
    closeNav({ returnFocus: true });
  }
});

if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

function showSpotlight(target) {
  spotlightTabs.forEach((tab) => {
    const isActive = tab.dataset.spotlightTarget === target;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  spotlightPanels.forEach((panel) => {
    const matches = panel.dataset.spotlightPanel === target;
    panel.toggleAttribute('hidden', !matches);
    panel.classList.toggle('is-active', matches);
  });
}

if (spotlightTabs.length) {
  spotlightTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      showSpotlight(tab.dataset.spotlightTarget);
    });
  });
  showSpotlight(spotlightTabs[0].dataset.spotlightTarget);
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    contactForm.reset();
    if (contactFeedback) {
      contactFeedback.hidden = false;
      contactFeedback.focus();
      window.setTimeout(() => {
        contactFeedback?.setAttribute('hidden', '');
      }, 8000);
    }
  });

  const fields = contactForm.querySelectorAll('input, select, textarea');
  fields.forEach((field) => {
    field.addEventListener('input', () => {
      if (contactFeedback && !contactFeedback.hidden) {
        contactFeedback.setAttribute('hidden', '');
      }
    });
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!newsletterForm.checkValidity()) {
      newsletterForm.reportValidity();
      return;
    }

    newsletterForm.reset();
    if (newsletterFeedback) {
      newsletterFeedback.hidden = false;
      newsletterFeedback.focus();
      window.setTimeout(() => {
        newsletterFeedback?.setAttribute('hidden', '');
      }, 8000);
    }
  });

  const newsletterFields = newsletterForm.querySelectorAll('input');
  newsletterFields.forEach((field) => {
    field.addEventListener('input', () => {
      if (newsletterFeedback && !newsletterFeedback.hidden) {
        newsletterFeedback.setAttribute('hidden', '');
      }
    });
  });
}
