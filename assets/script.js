const root = document.documentElement;
const body = document.body;
const themeToggleButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggleButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-list');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const desktopNav = window.matchMedia('(min-width: 768px)');

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

const projectPreviewGroups = document.querySelectorAll('[data-preview-group]');

projectPreviewGroups.forEach((group) => {
  const stageImage = group.querySelector('[data-preview-stage]');
  const stageCaption = group.querySelector('[data-preview-caption]');
  const previewItems = group.querySelectorAll('[data-preview-item]');

  if (!stageImage || !stageCaption || !previewItems.length) {
    return;
  }

  function activateItem(item) {
    previewItems.forEach((element) => {
      element.classList.toggle('is-active', element === item);
    });

    const { previewImage, previewAlt, previewCaption } = item.dataset;
    if (previewImage) {
      stageImage.src = previewImage;
    }
    if (previewAlt) {
      stageImage.alt = previewAlt;
    }
    if (previewCaption) {
      stageCaption.textContent = previewCaption;
    }
  }

  previewItems.forEach((item) => {
    item.addEventListener('click', () => {
      activateItem(item);
    });
  });

  const initiallyActive = group.querySelector('[data-preview-item].is-active') || previewItems[0];
  if (initiallyActive) {
    activateItem(initiallyActive);
  }
});
