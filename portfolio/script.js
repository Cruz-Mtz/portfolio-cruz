
const phrases = [
  "Estudiante de Ingeniería",
  "Desarrollador Junior",
  "Aprendiz de Frontend",
  "Entusiasta de la Tecnología"
];
let phraseIdx = 0,
  charIdx = 0,
  deleting = false;
const el = document.getElementById("typed-text");

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 55 : 95);
}
setTimeout(type, 800);

// ─── NAV ACTIVE STATE
const sections = document.querySelectorAll("section[id], div[id]");
const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(
          `nav a[href="#${entry.target.id}"]`,
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { threshold: 0.4 },
);

document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));

// ─── SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((r) => revealObs.observe(r));

// ─── NM PRESS EFFECT
document
  .querySelectorAll(".btn-primary, .btn-secondary, .btn-card, .btn-service")
  .forEach((btn) => {
    btn.addEventListener(
      "mousedown",
      () => (btn.style.transform = "scale(.97)"),
    );
    btn.addEventListener("mouseup", () => (btn.style.transform = ""));
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });
