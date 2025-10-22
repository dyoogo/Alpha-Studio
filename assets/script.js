const root = document.documentElement;
const body = document.body;
const themeToggleButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggleButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-list');
const header = document.querySelector('.header');
const contactForm = document.querySelector('.contact__form');
const contactFeedback = contactForm?.querySelector('.contact__feedback');
const faqButtons = document.querySelectorAll('.faq__button');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const desktopNav = window.matchMedia('(min-width: 768px)');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const THEME_KEY = 'alpha-studio-theme';

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  body.setAttribute('data-theme', theme);
  themeToggleButton.setAttribute('aria-pressed', theme === 'dark');
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem(THEME_KEY, theme);
}

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return prefersDark.matches ? 'dark' : 'light';
}

setTheme(getStoredTheme());

function applyMotionPreference(mediaQuery) {
  const shouldReduce = mediaQuery.matches;
  root.setAttribute('data-motion', shouldReduce ? 'reduced' : 'full');
}

applyMotionPreference(prefersReducedMotion);

function syncMenuVisibility(mediaQuery) {
  if (!menu || !menuToggleButton) {
    return;
  }
  if (mediaQuery.matches) {
    menuToggleButton.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  } else {
    menuToggleButton.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
}

syncMenuVisibility(desktopNav);

themeToggleButton.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

prefersDark.addEventListener('change', (event) => {
  const stored = localStorage.getItem(THEME_KEY);
  if (!stored) {
    setTheme(event.matches ? 'dark' : 'light');
  }
});

desktopNav.addEventListener('change', () => {
  syncMenuVisibility(desktopNav);
});

prefersReducedMotion.addEventListener('change', (event) => {
  applyMotionPreference(event);
});

if (menu && menuToggleButton) {
  menuToggleButton.addEventListener('click', () => {
    const expanded = menuToggleButton.getAttribute('aria-expanded') === 'true';
    menuToggleButton.setAttribute('aria-expanded', String(!expanded));
    const isHidden = menu.getAttribute('aria-hidden') === 'true';
    menu.setAttribute('aria-hidden', String(!isHidden));
  });
}

const currentYearSpan = document.querySelector('#current-year');
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// Fecha o menu quando um link é selecionado em telas pequenas
if (menu && menuToggleButton) {
  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggleButton.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
  });
}

const previewButtons = document.querySelectorAll('[data-preview-target]');
const previewImage = document.querySelector('[data-preview-image]');
const previewTitle = document.querySelector('[data-preview-title]');
const previewHighlight = document.querySelector('[data-preview-highlight]');
const previewStack = document.querySelector('[data-preview-stack]');
const previewDescription = document.querySelector('[data-preview-description]');
const previewPanel = document.querySelector('#preview-panel');

const previewData = {
  console: {
    title: 'Battle Alpha',
    highlight: 'Matchmaking global em tempo real com telemetria avançada.',
    stack: 'Unity HDRP · Netcode · PlayFab · Azure PlayStream',
    description: 'Combates 5v5 com efeitos visuais de partículas e HUD adaptável para e-sports.',
    image: './assets/Battle Alpha.d713c8c9.jpg',
    alt: 'Cena do jogo Battle Alpha mostrando uma arena futurista iluminada.'
  },
  mobile: {
    title: 'Project Secret',
    highlight: 'Narrativa episódica com decisões ramificadas alimentadas por IA.',
    stack: 'Unity URP · Firebase · OpenAI APIs · Analytics em tempo real',
    description: 'Experiência mobile com interface minimalista, animações fluidas e sincronização na nuvem.',
    image: './assets/PRojectSecret.38ba3f53.png',
    alt: 'Interface mobile minimalista do Project Secret exibindo escolha de narrativa.'
  },
  desktop: {
    title: 'Nightmare',
    highlight: 'Áudio espacial dinâmico e ferramentas de streaming integradas.',
    stack: 'Unity HDRP · FMOD · AWS Gamelift · Grafana',
    description: 'Atmosfera sombria com iluminação volumétrica e monitoramento de performance em tempo real.',
    image: './assets/imgNightmare.a65da0d6.jpg',
    alt: 'Cena assustadora do jogo Nightmare com luzes e neblina.'
  }
};

function updatePreview(targetKey) {
  const data = previewData[targetKey];
  if (!data || !previewImage || !previewTitle || !previewHighlight || !previewDescription || !previewStack) {
    return;
  }

  previewButtons.forEach((button) => {
    const isActive = button.dataset.previewTarget === targetKey;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  previewImage.src = data.image;
  previewImage.alt = data.alt;
  previewTitle.textContent = data.title;
  previewHighlight.textContent = data.highlight;
  previewStack.textContent = data.stack;
  previewDescription.textContent = data.description;

  if (previewPanel) {
    const activeButton = document.querySelector(`[data-preview-target="${targetKey}"]`);
    if (activeButton?.id) {
      previewPanel.setAttribute('aria-labelledby', activeButton.id);
    }
  }
}

previewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    updatePreview(button.dataset.previewTarget);
  });
});

if (previewButtons.length) {
  updatePreview('console');
}

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    faqButtons.forEach((otherButton) => {
      if (otherButton !== button) {
        otherButton.setAttribute('aria-expanded', 'false');
        const otherPanel = otherButton.closest('.faq__item')?.querySelector('.faq__panel');
        if (otherPanel) {
          otherPanel.hidden = true;
        }
      }
    });

    const panel = button.closest('.faq__item')?.querySelector('.faq__panel');
    button.setAttribute('aria-expanded', String(!expanded));
    if (panel) {
      panel.hidden = expanded;
    }
  });
});

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

  const formFields = contactForm.querySelectorAll('input, select, textarea');
  formFields.forEach((field) => {
    field.addEventListener('input', () => {
      if (contactFeedback && !contactFeedback.hidden) {
        contactFeedback.setAttribute('hidden', '');
      }
    });
  });
}

function updateHeaderState() {
  if (!header) {
    return;
  }
  const shouldCondense = window.scrollY > 16;
  header.classList.toggle('header--scrolled', shouldCondense);
}

updateHeaderState();

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeaderState();
      ticking = false;
    });
    ticking = true;
  }
});
