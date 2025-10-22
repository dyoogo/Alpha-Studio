const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const currentYearSpan = document.querySelector('[data-current-year]');
const contactForm = document.querySelector('[data-contact-form]');
const contactFeedback = document.querySelector('[data-contact-feedback]');
const newsletterForm = document.querySelector('[data-newsletter-form]');
const newsletterFeedback = document.querySelector('[data-newsletter-feedback]');
const spotlightTabs = document.querySelectorAll('[data-spotlight-target]');
const spotlightPanels = document.querySelectorAll('[data-spotlight-panel]');
const desktopNav = window.matchMedia('(min-width: 961px)');

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
  } else {
    navList.setAttribute('aria-hidden', nav.classList.contains('is-open') ? 'false' : 'true');
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
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    if (navList) {
      navList.setAttribute('aria-hidden', String(!isOpen));
    }
  });
}

if (navList && navToggle) {
  navList.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    if (window.matchMedia('(max-width: 960px)').matches) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navList.setAttribute('aria-hidden', 'true');
    }
  });
}

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
