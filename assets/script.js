const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('[data-nav-panel]');
const navList = document.querySelector('.nav-list');
const navBackdrop = document.querySelector('.nav-backdrop');
const pageBody = document.body;
const navToggleLabel = navToggle?.querySelector('[data-nav-toggle-label]');
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
  if (!nav || !navToggle) return;

  nav.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.classList.toggle('is-active', isOpen);

  if (navToggleLabel) {
    navToggleLabel.textContent = isOpen ? 'Fechar' : 'Menu';
  }

  const shouldHidePanel = !desktopNav.matches && !isOpen;
  navPanel?.setAttribute('aria-hidden', String(shouldHidePanel));
  navList?.setAttribute('aria-hidden', String(shouldHidePanel));

  if (!desktopNav.matches) {
    navPanel?.classList.toggle('is-visible', isOpen);
    pageBody?.classList.toggle('is-nav-open', isOpen);
  } else {
    navPanel?.classList.remove('is-visible');
    navPanel?.setAttribute('aria-hidden', 'false');
    navList?.setAttribute('aria-hidden', 'false');
    pageBody?.classList.remove('is-nav-open');
  }

  const shouldHideBackdrop = !isOpen || desktopNav.matches;
  navBackdrop?.setAttribute('aria-hidden', String(shouldHideBackdrop));
}

function openNav() {
  if (!nav || !navToggle) return;
  if (desktopNav.matches) return;

  setNavState(true);
  const firstLink = navPanel?.querySelector('a') ?? navList?.querySelector('a');
  firstLink?.focus({ preventScroll: true });
}

function closeNav({ returnFocus = false } = {}) {
  if (!nav || !navToggle) return;
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
  if (!nav || !navToggle) return;
  if (mediaQuery.matches) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-active');
    navToggleLabel && (navToggleLabel.textContent = 'Menu');
    navList?.setAttribute('aria-hidden', 'false');
    navPanel?.setAttribute('aria-hidden', 'false');
    navBackdrop?.setAttribute('aria-hidden', 'true');
    pageBody?.classList.remove('is-nav-open');
    navPanel?.classList.remove('is-visible');
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

if (navPanel && navToggle) {
  navPanel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLAnchorElement)) return;
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
