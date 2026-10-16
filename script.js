/*
  script.js — поведение страницы.

  Блоки файла:
  1. SITE_CONFIG — имя, Telegram, Max, почта и ВК. Это место, которое нужно править.
  2. Мобильное меню.
  3. Плавная прокрутка и подсветка текущего раздела.
  4. Появление карточек при прокрутке.
  5. Подстановка темы из карточек проектов.
  6. Проверка формы и открытие Telegram с готовым текстом.
*/

const SITE_CONFIG = {
  specialistName: "Алия Илюхина",
  /* Юзернейм Telegram для личных сообщений (без @) */
  telegramUsername: "neuroliya_ai",
  /* Ссылка на Telegram-канал */
  telegramChannelLink: "",
  /* Ссылка на личный Max или для связи */
  maxLink: "",
  /* Ссылка на канал в Max */
  maxChannelLink: "",
  /* Электронная почта */
  email: "",
  /* Ссылка на ВК для связи */
  vkLink: "",
  /* Ссылка на ВК-сообщество */
  vkCommunityLink: "",
  /* Ссылка на Instagram-страницу */
  instagramLink: ""
};

const header = document.querySelector("#header");
const nav = document.querySelector("#site-nav");
const navToggle = document.querySelector(".nav-toggle");
const menuLabel = document.querySelector("[data-menu-label]");
const yearNode = document.querySelector("#year");
const form = document.querySelector("#request-form");
const formFields = document.querySelector("#form-fields");
const formSuccess = document.querySelector("#form-success");
const formStatus = document.querySelector("#form-status");
const requestPreview = document.querySelector("#request-preview");
const telegramSend = document.querySelector("#telegram-send");
const editRequest = document.querySelector("#edit-request");
const taskField = document.querySelector("#task");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");

function telegramHref(text) {
  const username = SITE_CONFIG.telegramUsername.trim().replace(/^@/, "");
  const url = username
    ? new URL(`https://t.me/${username}`)
    : new URL("https://t.me/share/url");

  if (!username) {
    url.searchParams.set("url", window.location.href);
  }

  url.searchParams.set("text", text);
  return url.toString();
}

function applySiteConfig() {
  const name = SITE_CONFIG.specialistName.trim() || "Алия Илюхина";

  document.querySelectorAll("[data-specialist-name]").forEach((node) => {
    node.textContent = name;
  });

  const greeting = "Здравствуйте! Хочу обсудить проект.";
  document.querySelectorAll("#telegram-direct, #footer-telegram, #estimate-telegram").forEach((link) => {
    link.href = telegramHref(greeting);
  });

  document.querySelectorAll(".service-link[data-telegram-topic]").forEach((link) => {
    const topic = link.getAttribute("data-telegram-topic") || "услугу";
    link.href = telegramHref(`Здравствуйте! Хочу узнать больше про ${topic}.`);
  });

  const telegramChannel = SITE_CONFIG.telegramChannelLink.trim();
  const socialTelegram = document.querySelector("#social-telegram");
  if (socialTelegram && telegramChannel) {
    socialTelegram.href = telegramChannel;
  }

  const maxLink = SITE_CONFIG.maxLink.trim();
  document.querySelectorAll("#max-direct, #footer-max").forEach((link) => {
    if (maxLink) {
      link.href = maxLink;
    }
  });

  const maxChannel = SITE_CONFIG.maxChannelLink.trim() || maxLink;
  const socialMax = document.querySelector("#social-max");
  if (socialMax && maxChannel) {
    socialMax.href = maxChannel;
  }

  const email = SITE_CONFIG.email.trim();
  document.querySelectorAll("#email-direct, #footer-email").forEach((link) => {
    if (email) {
      link.href = `mailto:${email}?subject=${encodeURIComponent("Заявка с сайта")}&body=${encodeURIComponent(greeting)}`;
    }
  });

  const vkLink = SITE_CONFIG.vkLink.trim();
  document.querySelectorAll("#vk-direct, #footer-vk").forEach((link) => {
    if (vkLink) {
      link.href = vkLink;
    }
  });

  const vkCommunity = SITE_CONFIG.vkCommunityLink.trim() || vkLink;
  const socialVk = document.querySelector("#social-vk");
  if (socialVk && vkCommunity) {
    socialVk.href = vkCommunity;
  }

  const instagram = SITE_CONFIG.instagramLink.trim();
  const socialInstagram = document.querySelector("#social-instagram");
  if (socialInstagram && instagram) {
    socialInstagram.href = instagram;
  }

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

function setMenu(isOpen) {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);

  if (menuLabel) {
    menuLabel.textContent = isOpen ? "Закрыть меню" : "Открыть меню";
  }
}

function closeMenu() {
  setMenu(false);
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!header || !nav || !nav.classList.contains("is-open")) {
    return;
  }

  if (!header.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1080) {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) {
    return;
  }

  const id = link.getAttribute("href");
  const target = id ? document.querySelector(id) : null;
  if (!target) {
    return;
  }

  event.preventDefault();

  const hint = link.getAttribute("data-task-hint");
  if (hint && taskField && taskField.value.trim() === "") {
    taskField.value = hint;
  }

  closeMenu();
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start"
  });

  if (history.replaceState) {
    history.replaceState(null, "", id);
  }
});

const sectionLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const hero = document.querySelector("#hero");
const observedSections = hero ? [hero, ...sections] : sections;

function setActiveSection(id) {
  sectionLinks.forEach((link) => {
    const isCurrent = id && link.getAttribute("href") === id;
    link.classList.toggle("is-active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      /* На главном экране ни один пункт меню не подсвечиваем. */
      setActiveSection(entry.target.id === "hero" ? "" : `#${entry.target.id}`);
    });
  }, {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0.01
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

function updateHeaderShadow() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

updateHeaderShadow();
window.addEventListener("scroll", updateHeaderShadow, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const formRules = [
  {
    input: document.querySelector("#name"),
    empty: "Напишите, как к вам обращаться.",
    short: "Имя слишком короткое — нужно хотя бы 2 символа.",
    min: 2
  },
  {
    input: document.querySelector("#contact-method"),
    empty: "Укажите Telegram, телефон или почту.",
    short: "Контакт слишком короткий. Добавьте @username, телефон или почту.",
    min: 3
  },
  {
    input: document.querySelector("#task"),
    empty: "Опишите задачу.",
    short: "Добавьте чуть больше деталей: что нужно сделать и для кого.",
    min: 10
  }
];

function setFieldError(input, message) {
  const error = document.getElementById(input.getAttribute("aria-describedby"));
  if (!error) {
    return;
  }

  if (message) {
    input.setAttribute("aria-invalid", "true");
    error.hidden = false;
    error.textContent = message;
    return;
  }

  input.removeAttribute("aria-invalid");
  error.hidden = true;
  error.textContent = "";
}

function validateField(rule) {
  const value = rule.input.value.trim();

  if (!value) {
    setFieldError(rule.input, rule.empty);
    return false;
  }

  if (value.length < rule.min) {
    setFieldError(rule.input, rule.short);
    return false;
  }

  setFieldError(rule.input, "");
  return true;
}

function showFormFields() {
  formFields.hidden = false;
  formSuccess.hidden = true;
}

function buildRequest(name, contact, task) {
  return [
    "Здравствуйте!",
    `Меня зовут ${name}.`,
    `Связь: ${contact}.`,
    `Задача: ${task}`
  ].join("\n");
}

if (form) {
  formRules.forEach((rule) => {
    rule.input.addEventListener("input", () => {
      if (rule.input.getAttribute("aria-invalid") === "true") {
        validateField(rule);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    let isValid = true;

    formRules.forEach((rule) => {
      const fieldIsValid = validateField(rule);
      if (!fieldIsValid) {
        isValid = false;
        if (!firstInvalid) {
          firstInvalid = rule.input;
        }
      }
    });

    if (!isValid) {
      if (formStatus) {
        formStatus.textContent = "Проверьте обязательные поля формы.";
      }
      firstInvalid.focus();
      return;
    }

    const message = buildRequest(
      formRules[0].input.value.trim(),
      formRules[1].input.value.trim(),
      formRules[2].input.value.trim()
    );

    requestPreview.textContent = message;
    telegramSend.href = telegramHref(message);
    formFields.hidden = true;
    formSuccess.hidden = false;

    if (formStatus) {
      formStatus.textContent = "Заявка проверена. Откройте Telegram, чтобы отправить текст.";
    }

    telegramSend.focus();
  });
}

if (editRequest) {
  editRequest.addEventListener("click", () => {
    showFormFields();
    if (formStatus) {
      formStatus.textContent = "Можно изменить заявку.";
    }
    formRules[0].input.focus();
  });
}

applySiteConfig();
