const data = window.SITE_DATA;
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const crewGrid = document.querySelector("#crew-grid");
crewGrid.innerHTML = data.members.map((m, i) => `
  <article class="crew-card">

    <button class="crew-photo-open"
      data-member-index="${i}"
      aria-label="Открыть профиль ${esc(m.name)}">
      <div class="crew-photo">
        ${m.photo
          ? `<img src="${esc(m.photo)}" alt="Фото ${esc(m.name)}">`
          : `<div class="photo-label">✧ ДОБАВЬТЕ ФОТО</div>`
        }
      </div>
    </button>

    <div class="crew-info">
      <h3>
        <button class="crew-name-open" data-member-index="${i}">
          ${esc(m.name)}
        </button>
      </h3>
      <div class="crew-role">${esc(m.role)}</div>
      <p>${esc(m.group)}</p>
    </div>

  </article>
`).join("");

// Открытие подробного профиля
crewGrid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-member-index]");
  if (!trigger) return;

  const member = data.members[Number(trigger.dataset.memberIndex)];

  const oldProfile = document.querySelector(".profile-overlay");
  if (oldProfile) oldProfile.remove();

  const profile = document.createElement("div");
  profile.className = "profile-overlay";

  profile.innerHTML = `
    <div class="profile-panel">

    <button class="profile-image-close" type="button" aria-label="Переключить фотографию">
    <span class="profile-photo-flipper">
      <span class="profile-photo-side profile-photo-front">
        ${member.photo
          ? `<img src="${esc(member.photo)}" alt="${esc(member.name)}">`
          : `<div class="profile-placeholder">Фото участника</div>`}
      </span>
  
      <span class="profile-photo-side profile-photo-back">
        ${member.photoBack
          ? `<img src="${esc(member.photoBack)}" alt="${esc(member.name)}">`
          : `<div class="profile-placeholder">Вторая фотография</div>`}
      </span>
    </span>
  </button>

      <div class="profile-details">
        <button class="profile-close" aria-label="Закрыть">×</button>

        <p class="profile-label">КОМАНДА «СО ДНА»</p>

        <h2>${esc(member.name)}</h2>

        <div class="profile-divider"></div>

        <h4>Вклад в проект</h4>

        <p>${esc(member.contribution || "Информация скоро появится...")}</p>
        <button class="profile-contact-open" type="button">
        <span>Связаться с участником</span>
        <span>↗</span>
      </button>
      </div>

    </div>
  `;

  document.body.appendChild(profile);

  profile.addEventListener("click", async (e) => {
    const photoButton = e.target.closest(".profile-image-close");
  
    if (photoButton) {
      photoButton.classList.toggle("is-flipped");
      return;
    }
  
    const contactButton = e.target.closest(".profile-contact-open");
  
    if (contactButton) {
      const oldModal = profile.querySelector(".profile-contact-modal");
      if (oldModal) oldModal.remove();
  
      const modal = document.createElement("div");
      modal.className = "profile-contact-modal";
  
      const contacts = [
        ["telegram", "Telegram", member.telegram, "send"],
        ["phone", "Телефон", member.phone, "phone"],
        ["email", "Почта", member.email, "mail"]
      ];
  
      modal.innerHTML = `
        <div class="profile-contact-box">
          <button class="profile-contact-close" type="button">×</button>
          <p class="profile-label">КОМАНДА «СО ДНА»</p>
          <h3>Контакты участника</h3>
          ${contacts.map(([key, label, value]) => value ? `
            <div class="contact-copy-row">
              <div>
                <span class="contact-copy-label">${label}</span>
                <span class="contact-copy-value">${esc(value)}</span>
              </div>
              <button class="contact-copy-button" type="button" data-copy="${key}">
                Копировать
              </button>
            </div>
          ` : "").join("")}
        </div>
      `;
  
      profile.appendChild(modal);
      return;
    }
  
    const copyButton = e.target.closest("[data-copy]");
  
    if (copyButton) {
      const value = member[copyButton.dataset.copy];
  
      if (value) {
        try {
          await navigator.clipboard.writeText(value);
          copyButton.textContent = "Скопировано ✓";
        } catch {
          copyButton.textContent = "Не удалось скопировать";
        }
      }
      return;
    }
  
    if (
      e.target.closest(".profile-contact-close") ||
      e.target.classList.contains("profile-contact-modal")
    ) {
      const modal = profile.querySelector(".profile-contact-modal");
      if (modal) modal.remove();
      return;
    }
  
    if (
      e.target === profile ||
      e.target.closest(".profile-close")
    ) {
      profile.classList.add("profile-closing");
      setTimeout(() => profile.remove(), 300);
    }
  });
});
document.querySelector("#skills-list").innerHTML = data.skills.map((s,i)=>`
  <article class="skill-item"><span class="skill-num">0${i+1} / EQUIPMENT</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("");
document.querySelector("#projects-grid").innerHTML = data.projects.map((p,i)=>`
  <article class="project-card"><span class="project-id">DISCOVERY / 0${i+1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><span class="project-tag">${esc(p.tag)}</span></article>`).join("");
document.querySelector("#contact-links").innerHTML = data.contacts.filter(c=>c.href && c.href.trim()).map(c=>`
  <a href="${esc(c.href)}" target="_blank" rel="noopener noreferrer">${esc(c.label)} ↗</a>`).join("");
const toggle = document.querySelector(".nav-toggle"), nav = document.querySelector(".nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); toggle.textContent="☰";
}));
// Пузырьки, всплывающие по всему сайту
function createOceanBubbles() {
  if (document.querySelector(".ocean-bubbles")) return;

  const layer = document.createElement("div");
  layer.className = "ocean-bubbles";

  for (let i = 0; i < 30; i++) {
    const bubble = document.createElement("span");
    bubble.className = "ocean-bubble";

    const side = Math.random() < 0.5;
    bubble.style.left = side
    ? `${Math.random() * 12}%`
    : `${88 + Math.random() * 12}%`;
    bubble.style.width = `${6 + Math.random() * 16}px`;
    bubble.style.height = bubble.style.width;
    bubble.style.animationDuration = `${12 + Math.random() * 18}s`;
    bubble.style.animationDelay = `${-Math.random() * 25}s`;

    layer.appendChild(bubble);
  }

  document.body.prepend(layer);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createOceanBubbles);
} else {
  createOceanBubbles();
}
