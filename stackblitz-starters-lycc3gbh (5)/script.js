const data = window.SITE_DATA;
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
const crewGrid = document.querySelector("#crew-grid");
crewGrid.innerHTML = data.members.map((m, i) => `
  <article class="crew-card">

    <button class="crew-photo-open"
      data-member-index="${i}"
      aria-label="Открыть профиль ${esc(m.name)}">
      <div class="crew-photo">
        ${m.photo
          ? `<img src="${esc(m.photo)}" alt="Фото ${esc(m.name)}">`
          : `<div class="photo-label"><b>✧</b>ДОБАВЬТЕ ФОТО</div>`
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
      ${m.contact
        ? `<a href="${esc(m.contact)}">Контакт участника</a>`
        : ""}
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

      <button class="profile-image-close" aria-label="Закрыть профиль">
        ${member.photo
          ? `<img src="${esc(member.photo)}" alt="${esc(member.name)}">`
          : `<div class="profile-placeholder">✧</div>`
        }
      </button>

      <div class="profile-details">
        <button class="profile-close" aria-label="Закрыть">×</button>

        <p class="profile-label">КОМАНДА «СО ДНА»</p>

        <h2>${esc(member.name)}</h2>

        <div class="profile-divider"></div>

        <h4>Вклад в проект</h4>

        <p>${esc(member.contribution || "Информация скоро появится...")}</p>
      </div>

    </div>
  `;

  document.body.appendChild(profile);

  profile.addEventListener("click", (e) => {
    if (
      e.target === profile ||
      e.target.closest(".profile-close") ||
      e.target.closest(".profile-image-close")
    ) {
      profile.classList.add("profile-closing");
      setTimeout(() => profile.remove(), 300);
    }
  });
});
document.querySelector("#skills-list").innerHTML = data.skills.map(s=>`
  <article class="skill-item"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("");
document.querySelector("#projects-grid").innerHTML = data.projects.map(p=>`
  <article class="project-card"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><span class="project-tag">${esc(p.tag)}</span></article>`).join("");
  document.querySelector("#contact-links").innerHTML =
  data.contacts
    .filter(c => c.href && c.href.trim())
    .map(c => `
      <a
        class="telegram-button"
        href="${esc(c.href)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="telegram-icon">✈</span>
        ${esc(c.label)}
        <span class="telegram-arrow">↗</span>
      </a>
    `).join("");
const toggle = document.querySelector(".nav-toggle"), nav = document.querySelector(".nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); toggle.textContent="☰";
}));

