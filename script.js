import { validateInquiry, validateInquiryField } from './scripts/form-validation.mjs';

document.documentElement.classList.add('js');

const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');
const submitButton = form?.querySelector('button[type="button"]');

if (form && status && submitButton) {
  const fields = ['name', 'phone', 'region'];

  const renderFieldError = (field, message) => {
    const input = form.elements.namedItem(field);
    const error = form.querySelector(`[data-error-for="${field}"]`);

    if (input instanceof HTMLElement) {
      if (message) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    }
    if (error) {
      error.textContent = message ?? '';
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const values = Object.fromEntries(fields.map((field) => [field, formData.get(field)]));
    const errors = validateInquiry(values);

    for (const field of fields) {
      const message = errors[field] ?? '';
      renderFieldError(field, message);
    }

    const firstInvalidField = fields.find((field) => errors[field]);
    if (firstInvalidField) {
      status.textContent = '입력 내용을 확인해주세요.';
      form.elements.namedItem(firstInvalidField)?.focus();
      return;
    }

    status.textContent = '현재는 디자인 데모이며 상담 접수 연동 전입니다.';
  });

  submitButton.type = 'submit';

  for (const field of fields) {
    const input = form.elements.namedItem(field);
    input?.addEventListener('input', () => {
      const message = validateInquiryField(field, input.value);
      renderFieldError(field, message);

      const hasVisibleErrors = fields.some((candidate) =>
        form.querySelector(`[data-error-for="${candidate}"]`)?.textContent,
      );
      status.textContent = hasVisibleErrors ? '입력 내용을 확인해주세요.' : '';
    });
  }
}

const navigation = document.querySelector('#primary-navigation');
const navigationToggle = document.querySelector('.mobile-nav-toggle');

if (navigation && navigationToggle) {
  const closeNavigation = () => {
    navigation.classList.remove('is-open');
    navigationToggle.setAttribute('aria-expanded', 'false');
    navigationToggle.setAttribute('aria-label', '메뉴 열기');
  };

  navigationToggle.addEventListener('click', () => {
    const isOpen = navigationToggle.getAttribute('aria-expanded') === 'true';
    navigation.classList.toggle('is-open', !isOpen);
    navigationToggle.setAttribute('aria-expanded', String(!isOpen));
    navigationToggle.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeNavigation();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeNavigation();
      navigationToggle.focus();
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -8%', threshold: 0.08 });

  revealElements.forEach((element) => observer.observe(element));
  document.documentElement.classList.add('reveal-ready');
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const spaceTabs = [...document.querySelectorAll('[role="tab"][aria-controls^="space-panel-"]')];

if (spaceTabs.length) {
  const activateSpaceTab = (nextTab, moveFocus = false) => {
    for (const tab of spaceTabs) {
      const selected = tab === nextTab;
      const panel = document.querySelector(`#${tab.getAttribute('aria-controls')}`);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (panel) panel.hidden = !selected;
    }
    if (moveFocus) nextTab.focus();
  };

  for (const tab of spaceTabs) {
    tab.addEventListener('click', () => activateSpaceTab(tab));
    tab.addEventListener('keydown', (event) => {
      const current = spaceTabs.indexOf(tab);
      const keyTargets = {
        ArrowRight: (current + 1) % spaceTabs.length,
        ArrowLeft: (current - 1 + spaceTabs.length) % spaceTabs.length,
        Home: 0,
        End: spaceTabs.length - 1,
      };
      if (event.key in keyTargets) {
        event.preventDefault();
        activateSpaceTab(spaceTabs[keyTargets[event.key]], true);
      }
    });
  }

  activateSpaceTab(spaceTabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? spaceTabs[0]);
}
