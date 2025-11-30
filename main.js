const header = document.getElementById("site-header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;

  if (currentY > 120 && delta > 4) {
    header.classList.add("header-hidden");
  } else if (delta < -4) {
    header.classList.remove("header-hidden");
  }

  lastScrollY = currentY;
});

// Navbar center toggle for mobile
const navCenter = document.getElementById("nav-center");
const navToggle = document.querySelector(".nav-toggle");
const navClose = document.querySelector(".nav-close");

function setNavOpen(open) {
  if (!navCenter) return;
  navCenter.classList.toggle("open", open);
  if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
}

if (navToggle) {
  navToggle.addEventListener("click", () => setNavOpen(!navCenter.classList.contains("open")));
}
if (navClose) {
  navClose.addEventListener("click", () => setNavOpen(false));
}

// Toast helper
const toastEl = document.getElementById("toast");
let toastTimeout;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2600);
}

// Smooth scroll with button feedback
function setupScrollTriggers() {
  const triggers = document.querySelectorAll("[data-scroll-target]");
  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetSel = el.getAttribute("data-scroll-target");
      if (!targetSel) return;
      const target = document.querySelector(targetSel);
      if (!target) return;

      e.preventDefault();
      // visual feedback
      el.classList.add("pressed");
      setTimeout(() => {
        el.classList.remove("pressed");
      }, 500);

      // nav item active color instantly on click
      if (el.classList.contains("nav-item")) {
        document.querySelectorAll(".nav-item").forEach((item) => {
          item.classList.remove("active");
        });
        el.classList.add("active");
        setNavOpen(false);
      }

      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    });
  });
}

setupScrollTriggers();

// Accordions
function setupAccordions() {
  const groups = document.querySelectorAll("[data-accordion-group]");
  groups.forEach((group) => {
    const triggers = group.querySelectorAll("[data-accordion]");
    const panels = group.querySelectorAll(".accordion-panel");

    function closeAll() {
      triggers.forEach((t) => t.classList.remove("open"));
      panels.forEach((p) => (p.style.maxHeight = null));
    }

    triggers.forEach((trigger, index) => {
      const panel = panels[index];
      if (!panel) return;
      trigger.addEventListener("click", () => {
        const isOpen = trigger.classList.contains("open");
        closeAll();
        if (!isOpen) {
          trigger.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  });
}

setupAccordions();

// Carousels (infinite)
function setupCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const items = carousel.querySelectorAll(".carousel-item");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    if (!track || items.length === 0) return;

    let index = 0;

    function update() {
      const width = carousel.clientWidth;
      track.style.transform = `translateX(${-index * width}px)`;
    }

    function goNext() {
      index = (index + 1) % items.length;
      update();
    }

    function goPrev() {
      index = (index - 1 + items.length) % items.length;
      update();
    }

    if (nextBtn) nextBtn.addEventListener("click", goNext);
    if (prevBtn) prevBtn.addEventListener("click", goPrev);
    window.addEventListener("resize", update);
    update();
  });
}

setupCarousels();

// Click-to-play video (section 10)
document.querySelectorAll("[data-click-video]").forEach((wrap) => {
  const thumb = wrap.querySelector(".video-thumb");
  const video = wrap.querySelector(".click-video-player");
  if (!thumb || !video) return;

  wrap.addEventListener("click", () => {
    if (video.paused) {
      thumb.classList.add("hidden");
      video.play().catch(() => {
        thumb.classList.remove("hidden");
      });
    } else {
      video.pause();
      thumb.classList.remove("hidden");
    }
  });
});

// Auto-grow underline textareas
document.querySelectorAll("[data-auto-grow]").forEach((ta) => {
  const el = ta;
  const resize = () => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  el.addEventListener("input", resize);
  resize();
});

// Form submit placeholder
const awesomeForm = document.getElementById("awesome-form");
if (awesomeForm) {
  awesomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    awesomeForm.reset();
    document.querySelectorAll("[data-auto-grow]").forEach((ta) => {
      ta.style.height = "auto";
    });
    showToast("Enquiry sent. We'll get back to you soon.");
  });
}