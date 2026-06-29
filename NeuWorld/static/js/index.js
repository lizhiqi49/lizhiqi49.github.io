const initIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    window.setTimeout(initIcons, 80);
  }
};

const initNavigation = () => {
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-links]");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-24% 0px -62% 0px",
      threshold: [0.1, 0.3, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
};

const initTabs = () => {
  const buttons = Array.from(document.querySelectorAll("[data-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-panel]"));

  const syncPanelVideos = () => {
    panels.forEach((panel) => {
      const videos = Array.from(panel.querySelectorAll("video"));
      videos.forEach((video) => {
        if (panel.hidden) {
          video.pause();
        } else if (video.autoplay) {
          video.play().catch(() => {});
        }
      });
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        const active = panel.dataset.panel === target;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });

      syncPanelVideos();
    });
  });

  syncPanelVideos();
};

const initCopyBibtex = () => {
  const button = document.querySelector("[data-copy-bibtex]");
  const bibtex = document.querySelector("#bibtex");

  if (!button || !bibtex) return;

  const label = button.querySelector("span");
  const originalLabel = label?.textContent || "Copy";

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(bibtex.textContent.trim());
      if (label) label.textContent = "Copied";
      window.setTimeout(() => {
        if (label) label.textContent = originalLabel;
      }, 1400);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(bibtex);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      if (label) label.textContent = "Selected";
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initIcons();
  initNavigation();
  initReveal();
  initTabs();
  initCopyBibtex();
});
