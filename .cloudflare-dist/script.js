const contextRoot = (context) => typeof context === "string" ? document.querySelector(context) : context;
const $ = (selector, context = document) => contextRoot(context).querySelector(selector);
const $$ = (selector, context = document) => [...contextRoot(context).querySelectorAll(selector)];

const CLIENTS_KEY = "forge.clients.v2";
const ACTIVE_WORKOUT_KEY = "forge.active-workout.v2";

const workoutTemplates = {
  "Push A": [
    { name: "Fekvenyomás", note: "RPE 8 • 2–3 perc pihenő", sets: 4, weight: 80, reps: 8 },
    { name: "Ferdepados kézisúlyzós nyomás", note: "RPE 8 • 90 mp pihenő", sets: 3, weight: 28, reps: 10 },
    { name: "Oldalemelés", note: "Kontrollált negatív • 60 mp", sets: 4, weight: 10, reps: 12 },
    { name: "Tricepsz letolás csigán", note: "Teljes mozgástartomány • 60 mp", sets: 3, weight: 32, reps: 12 }
  ],
  "Pull B": [
    { name: "Lehúzás mellhez", note: "Lapockából indíts • 90 mp", sets: 4, weight: 62, reps: 10 },
    { name: "Evezés csigán", note: "Mellkas kiemelve • 90 mp", sets: 4, weight: 58, reps: 10 },
    { name: "Hátsóváll gépen", note: "Kontrollált kivitelezés • 60 mp", sets: 3, weight: 34, reps: 14 },
    { name: "Bicepsz állva", note: "Ne lendíts • 60 mp", sets: 3, weight: 14, reps: 10 }
  ],
  "Legs A": [
    { name: "Guggolás", note: "RPE 8 • 3 perc pihenő", sets: 4, weight: 100, reps: 6 },
    { name: "Román felhúzás", note: "Csípőből indíts • 2 perc", sets: 4, weight: 84, reps: 8 },
    { name: "Lábtoló", note: "Teljes mélység • 90 mp", sets: 3, weight: 170, reps: 12 },
    { name: "Lábhajlítás", note: "1 mp megtartás • 60 mp", sets: 3, weight: 42, reps: 12 }
  ],
  "Full body": [
    { name: "Goblet guggolás", note: "Bemelegítés után • 90 mp", sets: 3, weight: 28, reps: 12 },
    { name: "Fekvenyomás", note: "RPE 7 • 2 perc", sets: 3, weight: 52, reps: 10 },
    { name: "Evezés csigán", note: "Semleges fogás • 90 mp", sets: 3, weight: 45, reps: 12 },
    { name: "Farmer séta", note: "30 méter • 60 mp", sets: 3, weight: 24, reps: 1 }
  ],
  "Alsótest": [
    { name: "Hip thrust", note: "2 mp megtartás fent", sets: 4, weight: 90, reps: 10 },
    { name: "Bolgár guggolás", note: "Oldalanként", sets: 3, weight: 18, reps: 10 },
    { name: "Román felhúzás", note: "Lassú negatív", sets: 3, weight: 62, reps: 10 },
    { name: "Csípő távolítás", note: "Bukásközeli", sets: 3, weight: 42, reps: 15 }
  ]
};

const defaultClients = [
  {
    id: "kovacs-mark", name: "Kovács Márk", initials: "KM", tone: "peach", status: "active",
    email: "mark.kovacs@example.hu", phone: "+36 30 555 0142", since: "2026. április 6.",
    goal: "Izomépítés", plan: "Push / Pull / Legs", weekTarget: 4, progress: "+16,8%", last: "Ma • 16:00",
    stats: { adherence: 89, sessions: 41, streak: 8, strength: 16.8, weight: 83.6, startWeight: 86.8, bodyFat: 16.8, waist: 86 },
    goals: [
      { label: "Fekvenyomás 100 kg", value: 92, detail: "92,5 / 100 kg" },
      { label: "Testzsír 15%", value: 78, detail: "16,8% → 15%" },
      { label: "Heti 4 edzés", value: 75, detail: "3 / 4 ezen a héten" }
    ],
    alerts: ["Korábbi jobb váll érzékenység", "Fej fölötti nyomásnál semleges fogás"],
    notes: "Jól reagál a fokozatos volumenemelésre. Fekvenyomásnál a könyök pozíciójára figyelni. Következő blokkban alsótest-volumen emelhető.",
    measurements: [
      { date: "2026-04-06", weight: 86.8, bodyFat: 19.2, waist: 92 },
      { date: "2026-05-04", weight: 85.4, bodyFat: 18.4, waist: 90 },
      { date: "2026-06-08", weight: 84.5, bodyFat: 17.6, waist: 88 },
      { date: "2026-07-06", weight: 83.6, bodyFat: 16.8, waist: 86 }
    ],
    records: [
      { exercise: "Fekvenyomás", value: "92,5 kg", delta: "+12,5 kg" },
      { exercise: "Guggolás", value: "125 kg", delta: "+15 kg" },
      { exercise: "Felhúzás", value: "155 kg", delta: "+20 kg" }
    ],
    upcoming: [
      { id: "mk-1", date: "2026-07-14", time: "16:00", name: "Push A", duration: 60, focus: "Mell, váll, tricepsz" },
      { id: "mk-2", date: "2026-07-16", time: "16:00", name: "Pull B", duration: 60, focus: "Hát, bicepsz" },
      { id: "mk-3", date: "2026-07-18", time: "10:00", name: "Legs A", duration: 75, focus: "Combfeszítő, farizom" }
    ],
    history: [
      { date: "2026-07-11", name: "Pull A", duration: 58, volume: 8420, sets: 16, rpe: 8.1 },
      { date: "2026-07-09", name: "Legs B", duration: 72, volume: 12340, sets: 18, rpe: 8.3 },
      { date: "2026-07-07", name: "Push B", duration: 61, volume: 7650, sets: 15, rpe: 7.9 }
    ]
  },
  {
    id: "nagy-fanni", name: "Nagy Fanni", initials: "NF", tone: "mint", status: "active",
    email: "fanni.nagy@example.hu", phone: "+36 20 555 0188", since: "2026. február 12.",
    goal: "Erőnövelés", plan: "Upper / Lower", weekTarget: 4, progress: "+12,4%", last: "Ma • 07:00",
    stats: { adherence: 94, sessions: 58, streak: 12, strength: 12.4, weight: 64.2, startWeight: 63.5, bodyFat: 22.4, waist: 70 },
    goals: [{ label: "Guggolás 90 kg", value: 91, detail: "82,5 / 90 kg" }, { label: "Heti 4 edzés", value: 100, detail: "4 / 4 teljesítve" }],
    alerts: ["Bal térd terhelését fokozatosan emelni"],
    notes: "Nagyon következetes. Guggolás mélysége sokat javult. A következő héten deload javasolt.",
    measurements: [{ date: "2026-04-01", weight: 63.5, bodyFat: 23.1, waist: 72 }, { date: "2026-07-01", weight: 64.2, bodyFat: 22.4, waist: 70 }],
    records: [{ exercise: "Guggolás", value: "82,5 kg", delta: "+10 kg" }, { exercise: "Felhúzás", value: "105 kg", delta: "+12,5 kg" }],
    upcoming: [{ id: "nf-1", date: "2026-07-15", time: "08:30", name: "Alsótest", duration: 60, focus: "Erő fókusz" }, { id: "nf-2", date: "2026-07-17", time: "07:00", name: "Full body", duration: 60, focus: "Deload" }],
    history: [{ date: "2026-07-14", name: "Alsótest", duration: 52, volume: 6780, sets: 15, rpe: 7.8 }, { date: "2026-07-12", name: "Felsőtest", duration: 56, volume: 4820, sets: 16, rpe: 8 }]
  },
  {
    id: "szabo-luca", name: "Szabó Luca", initials: "SL", tone: "violet", status: "active",
    email: "luca.szabo@example.hu", phone: "+36 70 555 0114", since: "2026. május 2.",
    goal: "Általános fittség", plan: "Full body", weekTarget: 3, progress: "+8,1%", last: "Ma • 17:30",
    stats: { adherence: 87, sessions: 24, streak: 6, strength: 8.1, weight: 58.7, startWeight: 60.1, bodyFat: 24.6, waist: 68 },
    goals: [{ label: "Fájdalommentes mozgás", value: 85, detail: "Stabil terhelhetőség" }, { label: "Heti 3 edzés", value: 67, detail: "2 / 3 ezen a héten" }],
    alerts: ["Ülőmunka miatti csípőmobilitás", "Edzés elején hosszabb mobilizálás"],
    notes: "A teljes testes rendszer jól tartható. Mobilitás és törzsstabilitás maradjon minden alkalom része.",
    measurements: [{ date: "2026-05-02", weight: 60.1, bodyFat: 25.8, waist: 71 }, { date: "2026-07-03", weight: 58.7, bodyFat: 24.6, waist: 68 }],
    records: [{ exercise: "Goblet guggolás", value: "32 kg", delta: "+8 kg" }, { exercise: "Plank", value: "95 mp", delta: "+35 mp" }],
    upcoming: [{ id: "sl-1", date: "2026-07-14", time: "17:30", name: "Full body", duration: 60, focus: "Technika és kondíció" }, { id: "sl-2", date: "2026-07-17", time: "17:30", name: "Full body", duration: 60, focus: "Progresszív terhelés" }],
    history: [{ date: "2026-07-10", name: "Full body", duration: 59, volume: 3250, sets: 14, rpe: 7.4 }]
  },
  {
    id: "balogh-tamas", name: "Balogh Tamás", initials: "BT", tone: "blue", status: "active",
    email: "tamas.balogh@example.hu", phone: "+36 30 555 0191", since: "2026. március 18.",
    goal: "Izomépítés", plan: "Pull fókusz", weekTarget: 4, progress: "+11,2%", last: "Ma • 19:00",
    stats: { adherence: 82, sessions: 37, streak: 5, strength: 11.2, weight: 78.4, startWeight: 75.9, bodyFat: 15.9, waist: 81 },
    goals: [{ label: "Testsúly 80 kg", value: 81, detail: "78,4 / 80 kg" }, { label: "10 szabályos húzódzkodás", value: 80, detail: "8 / 10 ismétlés" }],
    alerts: ["Könyök terhelése bicepszgyakorlatoknál"], notes: "Hátizom-kapcsolat javul. Fogáserőre külön blokkot érdemes tenni.",
    measurements: [{ date: "2026-03-18", weight: 75.9, bodyFat: 15.3, waist: 79 }, { date: "2026-07-02", weight: 78.4, bodyFat: 15.9, waist: 81 }],
    records: [{ exercise: "Húzódzkodás", value: "+15 kg", delta: "+10 kg" }, { exercise: "Evezés", value: "90 kg", delta: "+12 kg" }],
    upcoming: [{ id: "bt-1", date: "2026-07-14", time: "19:00", name: "Pull B", duration: 60, focus: "Hát, bicepsz" }],
    history: [{ date: "2026-07-12", name: "Push A", duration: 63, volume: 7180, sets: 16, rpe: 8.4 }]
  },
  {
    id: "varga-eszter", name: "Varga Eszter", initials: "VE", tone: "rose", status: "attention",
    email: "eszter.varga@example.hu", phone: "+36 20 555 0177", since: "2026. január 20.",
    goal: "Fogyás", plan: "Kondíció + erő", weekTarget: 3, progress: "−5,4 kg", last: "Tegnap",
    stats: { adherence: 68, sessions: 44, streak: 1, strength: 6.4, weight: 71.2, startWeight: 76.6, bodyFat: 29.1, waist: 82 },
    goals: [{ label: "Testsúly 68 kg", value: 63, detail: "71,2 / 68 kg" }, { label: "Heti 3 edzés", value: 33, detail: "1 / 3 ezen a héten" }],
    alerts: ["Két kihagyott edzés az elmúlt héten", "Alvás átlagosan 5–6 óra"], notes: "Terhelés helyett most a rendszeresség visszaépítése a prioritás. Rövidebb, teljesíthető alkalmak.",
    measurements: [{ date: "2026-01-20", weight: 76.6, bodyFat: 33.4, waist: 91 }, { date: "2026-07-05", weight: 71.2, bodyFat: 29.1, waist: 82 }],
    records: [{ exercise: "Lábtoló", value: "120 kg", delta: "+30 kg" }],
    upcoming: [{ id: "ve-1", date: "2026-07-16", time: "15:00", name: "Full body", duration: 45, focus: "Visszaszoktatás" }],
    history: [{ date: "2026-07-08", name: "Kondíció", duration: 42, volume: 2840, sets: 12, rpe: 7.1 }]
  },
  {
    id: "molnar-adam", name: "Molnár Ádám", initials: "MÁ", tone: "olive", status: "active",
    email: "adam.molnar@example.hu", phone: "+36 70 555 0155", since: "2025. november 8.",
    goal: "Erőnövelés", plan: "Powerbuilding", weekTarget: 4, progress: "+18,6%", last: "Júl. 11.",
    stats: { adherence: 91, sessions: 86, streak: 14, strength: 18.6, weight: 91.5, startWeight: 89.2, bodyFat: 18.2, waist: 92 },
    goals: [{ label: "Felhúzás 200 kg", value: 93, detail: "185 / 200 kg" }, { label: "Fekvenyomás 120 kg", value: 92, detail: "110 / 120 kg" }],
    alerts: ["Nagy fáradtság esetén top set elhagyható"], notes: "Jó terhelhetőség. Következő teszthét előtt volumen 30%-kal csökkentendő.",
    measurements: [{ date: "2026-01-10", weight: 89.2, bodyFat: 18.9, waist: 93 }, { date: "2026-07-01", weight: 91.5, bodyFat: 18.2, waist: 92 }],
    records: [{ exercise: "Felhúzás", value: "185 kg", delta: "+25 kg" }, { exercise: "Fekvenyomás", value: "110 kg", delta: "+17,5 kg" }],
    upcoming: [{ id: "ma-1", date: "2026-07-15", time: "09:00", name: "Legs A", duration: 90, focus: "Nehéz nap" }],
    history: [{ date: "2026-07-11", name: "Upper erő", duration: 84, volume: 15420, sets: 19, rpe: 8.7 }]
  }
];

const plans = [
  { letter: "P", name: "Push / Pull / Legs", client: "Kovács Márk", days: "4 nap / hét", phase: "4. hét / 8", updated: "Ma" },
  { letter: "U", name: "Upper / Lower", client: "Nagy Fanni", days: "4 nap / hét", phase: "6. hét / 8", updated: "Tegnap" },
  { letter: "F", name: "Full body", client: "Szabó Luca", days: "3 nap / hét", phase: "3. hét / 6", updated: "Júl. 11." },
  { letter: "P", name: "Pull fókusz", client: "Balogh Tamás", days: "4 nap / hét", phase: "2. hét / 6", updated: "Júl. 10." },
  { letter: "K", name: "Kondíció + erő", client: "Varga Eszter", days: "3 nap / hét", phase: "5. hét / 8", updated: "Júl. 8." }
];

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value || structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

let clients = readStore(CLIENTS_KEY, defaultClients);
let activeWorkout = readStore(ACTIVE_WORKOUT_KEY, null);
let selectedClientId = clients[0]?.id || null;
let toastTimer;

const navMeta = {
  dashboard: ["2026. JÚLIUS 14. • KEDD", "Jó reggelt, Gergő!"],
  clients: ["ÜGYFÉLKEZELÉS", "Edzettek"],
  clientDetail: ["EDZETT PROFIL", "Edzett áttekintése"],
  calendar: ["IDŐBEOSZTÁS", "Naptár"],
  plans: ["PROGRAMOZÁS", "Edzéstervek"],
  progress: ["MÉRÉS ÉS ELEMZÉS", "Fejlődés"]
};

function icon(id) { return `<svg><use href="#i-${id}"/></svg>`; }
function h(value = "") { return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function saveClients() { localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients)); }
function saveActiveWorkout() {
  if (activeWorkout) localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(activeWorkout));
  else localStorage.removeItem(ACTIVE_WORKOUT_KEY);
  updateActiveWorkoutBanner();
}
function getClient(id) { return clients.find(client => client.id === id); }
function formatNumber(value) { return Number(value || 0).toLocaleString("hu-HU"); }
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return hours ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}` : `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
function dateLabel(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("hu-HU", { month: "short", day: "numeric", weekday: "short" }).format(date);
}

function showView(name) {
  $$(".view").forEach(view => view.classList.toggle("active", view.dataset.viewName === name));
  $$(".nav-item[data-view]").forEach(item => item.classList.toggle("active", item.dataset.view === (name === "clientDetail" ? "clients" : name)));
  $("#eyebrow").textContent = navMeta[name][0];
  $("#pageTitle").textContent = navMeta[name][1];
  $("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-view]").forEach(element => element.addEventListener("click", () => showView(element.dataset.view)));
$("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
document.addEventListener("click", event => {
  if (innerWidth < 821 && !event.target.closest("#sidebar") && !event.target.closest("#mobileMenu")) $("#sidebar").classList.remove("open");
});

function updateClientCounts() {
  const active = clients.filter(client => client.status === "active").length;
  const attention = clients.filter(client => client.status === "attention").length;
  $("#clientNavCount").textContent = clients.length;
  $("#activeClientStat").textContent = active;
  const allCount = $(".filter-chips [data-filter='all'] span");
  const activeCount = $(".filter-chips [data-filter='active'] span");
  const attentionCount = $(".filter-chips [data-filter='attention'] span");
  if (allCount) allCount.textContent = clients.length;
  if (activeCount) activeCount.textContent = active;
  if (attentionCount) attentionCount.textContent = attention;
}

function renderRecent() {
  $("#recentClients").innerHTML = clients.slice(0, 4).map(client => `
    <button class="client-row client-row-button" data-client-id="${client.id}">
      <span class="client-avatar ${client.tone}">${h(client.initials)}</span>
      <span><strong>${h(client.name)}</strong><small>${h(client.plan)}</small></span>
      <span>${h(client.last)}</span><span class="progress-cell">${h(client.progress)}</span>${icon("chevron")}
    </button>`).join("");
  $$('[data-client-id]', "#recentClients").forEach(button => button.addEventListener("click", () => showClient(button.dataset.clientId)));
}

function renderClients() {
  const query = $("#clientSearch").value.toLowerCase();
  const filter = $(".filter-chips .active")?.dataset.filter || "all";
  let items = clients.filter(client => (`${client.name} ${client.goal} ${client.plan}`).toLowerCase().includes(query) && (filter === "all" || client.status === filter));
  if ($("#clientSort").value === "name") items.sort((a, b) => a.name.localeCompare(b.name, "hu"));
  if ($("#clientSort").value === "progress") items.sort((a, b) => b.stats.adherence - a.stats.adherence);
  $("#clientGrid").innerHTML = items.length ? items.map(client => `
    <article class="client-card" data-client-card="${client.id}">
      <div class="client-card-top"><div class="client-avatar ${client.tone}">${h(client.initials)}</div><div><h3>${h(client.name)}</h3><p class="goal">${h(client.goal)}</p></div><button class="icon-btn" aria-label="${h(client.name)} további lehetőségei">${icon("more")}</button></div>
      <span class="status-badge ${client.status}">${client.status === "active" ? "Aktív" : "Figyelmet kér"}</span>
      <div class="client-card-stats"><span><b>${client.stats.adherence}%</b>teljesítés</span><span><b>${h(client.progress)}</b>fejlődés</span><span><b>${client.upcoming.length}</b>tervezett</span></div>
      <div class="client-card-footer"><span>Utolsó: ${h(client.last)}</span><button data-open-client="${client.id}">Profil megnyitása →</button></div>
    </article>`).join("") : '<div class="empty-state">Nincs a keresésnek megfelelő edzett.</div>';
  $$('[data-open-client]', "#clientGrid").forEach(button => button.addEventListener("click", () => showClient(button.dataset.openClient)));
}

$("#clientSearch").addEventListener("input", renderClients);
$("#clientSort").addEventListener("change", renderClients);
$$(".filter-chips button").forEach(button => button.addEventListener("click", () => {
  $$(".filter-chips button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderClients();
}));

function measurementBars(client) {
  const values = client.measurements.map(item => item.weight);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  return client.measurements.map(item => {
    const height = 28 + ((item.weight - min) / Math.max(max - min, 1)) * 62;
    return `<div><i style="height:${height}%"></i><b>${item.weight}</b><span>${new Intl.DateTimeFormat("hu-HU", { month: "short" }).format(new Date(`${item.date}T12:00`))}</span></div>`;
  }).join("");
}

function showClient(id) {
  const client = getClient(id);
  if (!client) return;
  selectedClientId = id;
  renderClientProfile(client);
  showView("clientDetail");
}

function renderClientProfile(client = getClient(selectedClientId)) {
  if (!client) return;
  const next = client.upcoming.find(item => item.status !== "completed");
  const weightChange = (client.stats.weight - client.stats.startWeight).toFixed(1).replace("-", "−");
  $("#clientProfile").innerHTML = `
    <div class="profile-toolbar">
      <button class="back-button" id="backToClients">‹ Edzettek</button>
      <div class="profile-actions"><button class="secondary-button" id="scheduleForClient">${icon("calendar")} Edzés ütemezése</button><button class="primary-button" id="startClientWorkout" ${next ? "" : "disabled"}>${icon("play")} ${next ? "Következő edzés indítása" : "Nincs tervezett edzés"}</button></div>
    </div>
    <section class="profile-hero-card">
      <div class="profile-identity"><div class="client-avatar ${client.tone} profile-avatar">${h(client.initials)}</div><div><span class="status-badge ${client.status}">${client.status === "active" ? "Aktív együttműködés" : "Figyelmet kér"}</span><h2>${h(client.name)}</h2><p>${h(client.goal)} • ${h(client.plan)} • ${client.weekTarget} alkalom / hét</p></div></div>
      <div class="profile-contact"><span>${h(client.email)}</span><span>${h(client.phone)}</span><small>Kezdés: ${h(client.since)}</small></div>
    </section>
    <div class="profile-kpis">
      <article><span>EDZÉSTELJESÍTÉS</span><strong>${client.stats.adherence}%</strong><small>${client.stats.streak} alkalmas aktív sorozat</small></article>
      <article><span>ÖSSZES EDZÉS</span><strong>${client.stats.sessions}</strong><small>${client.history.length} részletes előzmény</small></article>
      <article><span>ERŐSZINT</span><strong>+${client.stats.strength}%</strong><small>A kezdés óta</small></article>
      <article class="accent-kpi"><span>TESTSÚLY</span><strong>${client.stats.weight} kg</strong><small>${weightChange} kg változás</small></article>
    </div>
    <div class="profile-layout">
      <div class="profile-main-column">
        <article class="panel profile-section">
          <div class="panel-heading"><div><span class="section-kicker">KÖVETKEZŐ ALKALMAK</span><h2>Előre tervezett edzések</h2></div><button class="text-btn" id="addProfileSession">Új időpont ${icon("plus")}</button></div>
          <div class="upcoming-list">${client.upcoming.length ? client.upcoming.map(item => {
            const completed = item.status === "completed";
            const isNext = next?.id === item.id;
            return `<div class="upcoming-workout ${isNext ? "next" : ""} ${completed ? "completed" : ""}"><div class="date-tile"><b>${dateLabel(item.date).split(" ")[1] || new Date(item.date).getDate()}</b><span>${dateLabel(item.date).split(" ")[0]}</span></div><div><strong>${h(item.name)}</strong><p>${completed ? "✓ Teljesítve" : h(item.focus || "Személyre szabott edzés")} • ${item.duration} perc</p></div><time>${h(item.time)}</time><button class="${isNext ? "primary-button compact" : "secondary-button compact"}" data-profile-workout="${item.id}" ${completed ? "disabled" : ""}>${completed ? icon("check") + " Kész" : (isNext ? icon("play") : "") + " Indítás"}</button></div>`;
          }).join("") : '<div class="empty-inline">Nincs előre tervezett edzés.</div>'}</div>
        </article>
        <article class="panel profile-section">
          <div class="panel-heading"><div><span class="section-kicker">TESTÖSSZETÉTEL</span><h2>Súlytrend és mérések</h2></div><button class="secondary-button compact" id="addMeasurement">${icon("plus")} Új mérés</button></div>
          <div class="measurement-summary"><div><span>AKTUÁLIS SÚLY</span><strong>${client.stats.weight} kg</strong></div><div><span>TESTZSÍR</span><strong>${client.stats.bodyFat}%</strong></div><div><span>DERÉK</span><strong>${client.stats.waist} cm</strong></div></div>
          <div class="measurement-chart">${measurementBars(client)}</div>
        </article>
        <article class="panel profile-section">
          <div class="panel-heading"><div><span class="section-kicker">EDZÉSTÖRTÉNET</span><h2>Legutóbbi edzések</h2></div><span class="profile-muted">${client.history.length} rögzített alkalom</span></div>
          <div class="history-table"><div class="history-row header"><span>DÁTUM / EDZÉS</span><span>IDŐ</span><span>VOLUMEN</span><span>RPE</span></div>${client.history.map(item => `<div class="history-row"><span><b>${h(item.name)}</b><small>${dateLabel(item.date)} • ${item.sets} sorozat</small></span><span>${item.duration} perc</span><span>${formatNumber(item.volume)} kg</span><span>${item.rpe || "—"}</span></div>`).join("")}</div>
        </article>
      </div>
      <aside class="profile-side-column">
        <article class="panel profile-section"><span class="section-kicker">AKTUÁLIS PROGRAM</span><h2>${h(client.plan)}</h2><div class="program-cycle"><span><b>4.</b> hét</span><div><i style="width:50%"></i></div><span>8 hét</span></div><button class="secondary-button full" data-open-plan>Edzésterv megnyitása</button></article>
        <article class="panel profile-section"><span class="section-kicker">CÉLOK</span><h2>Haladási irányok</h2><div class="goal-list">${client.goals.map(goal => `<div><p><strong>${h(goal.label)}</strong><span>${h(goal.detail)}</span></p><i><b style="width:${goal.value}%"></b></i></div>`).join("")}</div></article>
        <article class="panel profile-section ${client.alerts.length ? "alert-panel" : ""}"><span class="section-kicker">EGÉSZSÉG ÉS TERHELHETŐSÉG</span><h2>${client.alerts.length ? "Figyelmeztetések" : "Nincs korlátozás"}</h2><ul>${client.alerts.map(alert => `<li>${h(alert)}</li>`).join("")}</ul></article>
        <article class="panel profile-section"><span class="section-kicker">SZEMÉLYES REKORDOK</span><h2>Legjobb eredmények</h2><div class="records-list">${client.records.map(record => `<div><span>${h(record.exercise)}</span><strong>${h(record.value)}</strong><em>${h(record.delta)}</em></div>`).join("")}</div></article>
        <article class="panel profile-section"><span class="section-kicker">EDZŐI JEGYZET</span><h2>Következő fókusz</h2><textarea class="coach-notes" id="coachNotes" rows="6">${h(client.notes)}</textarea><button class="primary-button full" id="saveCoachNotes">Jegyzet mentése</button></article>
      </aside>
    </div>`;

  $("#backToClients").addEventListener("click", () => showView("clients"));
  $("#scheduleForClient").addEventListener("click", () => openScheduleModal(client.id));
  $("#addProfileSession").addEventListener("click", () => openScheduleModal(client.id));
  $("#addMeasurement").addEventListener("click", () => openMeasurementModal(client.id));
  $("#startClientWorkout").addEventListener("click", () => next && startWorkout(client.id, next.name, next.id));
  $$('[data-profile-workout]', "#clientProfile").forEach(button => button.addEventListener("click", () => {
    const session = client.upcoming.find(item => item.id === button.dataset.profileWorkout);
    if (session && session.status !== "completed") startWorkout(client.id, session.name, session.id);
  }));
  $("#saveCoachNotes").addEventListener("click", () => {
    client.notes = $("#coachNotes").value.trim();
    saveClients();
    toast("Jegyzet mentve", `${client.name} edzői jegyzete frissült.`);
  });
  $$('[data-open-plan]', "#clientProfile").forEach(button => button.addEventListener("click", () => openModal("#planModal")));
}

function renderPlans() {
  const query = $("#planSearch").value.toLowerCase();
  const list = plans.filter(plan => (`${plan.name} ${plan.client}`).toLowerCase().includes(query));
  $("#planTable").innerHTML = '<div class="plan-row header"><span>PROGRAM / EDZETT</span><span>GYAKORISÁG</span><span>CIKLUS</span><span>FRISSÍTVE</span><span></span></div>' + list.map(plan => `
    <div class="plan-row"><div class="plan-name"><span>${plan.letter}</span><div><b>${h(plan.name)}</b><small>${h(plan.client)}</small></div></div><span>${h(plan.days)}</span><span>${h(plan.phase)}</span><span>${h(plan.updated)}</span><button class="icon-btn" data-open-plan>${icon("more")}</button></div>`).join("");
  $$('[data-open-plan]', "#planTable").forEach(button => button.addEventListener("click", () => openModal("#planModal")));
}
$("#planSearch").addEventListener("input", renderPlans);

function renderCalendar() {
  const days = [["HÉT", "13"], ["KEDD", "14"], ["SZERDA", "15"], ["CSÜT", "16"], ["PÉNTEK", "17"], ["SZOMBAT", "18"], ["VASÁRNAP", "19"]];
  const events = Array.from({ length: 7 }, () => []);
  clients.forEach(client => client.upcoming.forEach(session => {
    const day = Number(session.date.slice(-2)) - 13;
    if (day >= 0 && day < 7) events[day].push({ client, session });
  }));
  let html = "<div></div>" + days.map((day, index) => `<div class="cal-header ${index === 1 ? "today" : ""}"><span>${day[0]}</span><b>${day[1]}</b></div>`).join("");
  html += '<div class="time-col">' + Array.from({ length: 14 }, (_, index) => `<span style="top:${index * 42}px">${String(index + 7).padStart(2, "0")}:00</span>`).join("") + "</div>";
  html += events.map((dayEvents, index) => `<div class="cal-day ${index === 1 ? "today" : ""}">${dayEvents.map(({ client, session }) => {
    const [hour, minute] = session.time.split(":").map(Number);
    const top = ((hour - 7) + minute / 60) * 42 + 4;
    const completed = session.status === "completed";
    return `<button class="cal-event ${client.tone} ${completed ? "done" : ""}" style="top:${top}px;height:${Math.max(38, session.duration * .65)}px" data-calendar-client="${client.id}" data-calendar-session="${session.id}" ${completed ? "disabled" : ""}><b>${h(client.name)}</b><span>${completed ? "✓ KÉSZ" : h(session.name)} • ${h(session.time)}</span></button>`;
  }).join("")}</div>`).join("");
  $("#weekCalendar").innerHTML = html;
  $$('[data-calendar-client]', "#weekCalendar").forEach(button => button.addEventListener("click", () => {
    const client = getClient(button.dataset.calendarClient);
    const session = client?.upcoming.find(item => item.id === button.dataset.calendarSession);
    if (client && session && session.status !== "completed") startWorkout(client.id, session.name, session.id);
  }));
}

function openModal(selector) {
  const modal = $(selector);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (!$(".modal-backdrop.open")) document.body.style.overflow = "";
}

$("#addClientBtn").addEventListener("click", () => openModal("#clientModal"));
$$("[data-open-plan]").forEach(button => button.addEventListener("click", () => openModal("#planModal")));
$$("[data-close-modal]").forEach(button => button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop"))));
$$(".modal-backdrop").forEach(modal => modal.addEventListener("click", event => {
  if (event.target === modal && modal.id !== "workoutModal") closeModal(modal);
}));

function toast(title = "Sikeres mentés", message = "A módosítások rögzítve.") {
  $("#toast strong").textContent = title;
  $("#toast p").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3200);
}

$("#clientForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const name = form.get("name").trim();
  const parts = name.split(/\s+/);
  const frequency = Number(String(form.get("frequency")).match(/\d+/)?.[0] || 3);
  const newClient = {
    id: `client-${Date.now()}`, name, initials: parts.map(part => part[0]).join("").slice(0, 2).toUpperCase(), tone: "peach", status: "active",
    email: form.get("email"), phone: form.get("phone") || "Nincs megadva", since: form.get("start"), goal: form.get("goal"), plan: "Még nincs kiosztott terv", weekTarget: frequency, progress: "—", last: "Most",
    stats: { adherence: 0, sessions: 0, streak: 0, strength: 0, weight: 0, startWeight: 0, bodyFat: 0, waist: 0 },
    goals: [{ label: form.get("goal"), value: 0, detail: "Kiinduló állapot" }], alerts: [], notes: form.get("note") || "", measurements: [], records: [], upcoming: [], history: []
  };
  clients.unshift(newClient);
  saveClients();
  updateClientCounts(); renderClients(); renderRecent(); renderCalendar();
  closeModal($("#clientModal")); event.target.reset();
  toast("Edzett létrehozva", `${name} teljes profilja elkészült.`);
  showClient(newClient.id);
});

$("#savePlan").addEventListener("click", () => { closeModal($("#planModal")); toast("Edzésterv frissítve", "A módosítások mentve."); });

function openMeasurementModal(clientId) {
  selectedClientId = clientId;
  const client = getClient(clientId);
  const form = $("#measurementForm");
  form.elements.weight.value = client?.stats.weight || "";
  form.elements.bodyFat.value = client?.stats.bodyFat || "";
  form.elements.waist.value = client?.stats.waist || "";
  openModal("#measurementModal");
}

$("#measurementForm").addEventListener("submit", event => {
  event.preventDefault();
  const client = getClient(selectedClientId);
  if (!client) return;
  const form = new FormData(event.target);
  const measurement = { date: form.get("date"), weight: Number(form.get("weight")), bodyFat: Number(form.get("bodyFat")) || client.stats.bodyFat, waist: Number(form.get("waist")) || client.stats.waist, note: form.get("note") };
  client.measurements.push(measurement);
  client.stats.weight = measurement.weight; client.stats.bodyFat = measurement.bodyFat; client.stats.waist = measurement.waist;
  saveClients(); closeModal($("#measurementModal")); renderClientProfile(client);
  toast("Mérés rögzítve", `${client.name}: ${measurement.weight} kg.`);
});

function openScheduleModal(clientId = selectedClientId || clients[0].id) {
  const form = $("#sessionForm");
  form.elements.clientId.value = clientId;
  openModal("#sessionModal");
}
$("#newSessionBtn").addEventListener("click", () => openScheduleModal());
$("#sessionForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const client = getClient(form.get("clientId"));
  if (!client) return;
  client.upcoming.push({ id: `session-${Date.now()}`, date: form.get("date"), time: form.get("time"), name: form.get("workout"), duration: Number(form.get("duration")), focus: form.get("note") || "Személyre szabott edzés" });
  client.upcoming.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  saveClients(); closeModal($("#sessionModal")); renderCalendar();
  if (selectedClientId === client.id && $("#clientDetailView").classList.contains("active")) renderClientProfile(client);
  toast("Edzés ütemezve", `${client.name} • ${dateLabel(form.get("date"))} ${form.get("time")}`);
});

function createWorkout(clientId, name, scheduledId) {
  const template = workoutTemplates[name] || workoutTemplates["Full body"];
  return {
    id: `workout-${Date.now()}`, clientId, name, scheduledId: scheduledId || null, startedAt: Date.now(), note: "", restUntil: null,
    exercises: template.map((exercise, exerciseIndex) => ({
      id: `exercise-${exerciseIndex}-${Date.now()}`, name: exercise.name, note: exercise.note,
      sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({ weight: exercise.weight, reps: exercise.reps, rpe: setIndex ? 8 : "", done: false, completedAt: null }))
    }))
  };
}

function startWorkout(clientId = "kovacs-mark", name = "Push A", scheduledId = "mk-1") {
  if (activeWorkout) {
    openActiveWorkout();
    const currentClient = getClient(activeWorkout.clientId);
    toast("Már fut egy edzés", `${currentClient?.name || "Edzett"} • ${activeWorkout.name} folytatása.`);
    return;
  }
  activeWorkout = createWorkout(clientId, name, scheduledId);
  saveActiveWorkout();
  renderWorkout();
  openModal("#workoutModal");
  toast("Edzés elindítva", "Minden adat automatikusan és tartósan mentődik.");
}

function workoutTotals() {
  if (!activeWorkout) return { all: 0, done: 0, volume: 0 };
  const sets = activeWorkout.exercises.flatMap(exercise => exercise.sets);
  const completed = sets.filter(set => set.done);
  return { all: sets.length, done: completed.length, volume: completed.reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0) };
}

function renderWorkout() {
  if (!activeWorkout) return;
  const client = getClient(activeWorkout.clientId);
  $("#workoutTitle").textContent = activeWorkout.name;
  $("#workoutSubtitle").textContent = `${client?.name || "Edzett"} • folyamatos munkamenet`;
  $("#exerciseCount").textContent = activeWorkout.exercises.length;
  $("#workoutNote").value = activeWorkout.note || "";
  $("#exerciseList").innerHTML = activeWorkout.exercises.map((exercise, exerciseIndex) => `
    <article class="exercise-card"><div class="exercise-heading"><span class="exercise-index">${String(exerciseIndex + 1).padStart(2, "0")}</span><div><strong>${h(exercise.name)}</strong><span>${h(exercise.note)}</span></div><button class="icon-btn" aria-label="Gyakorlat beállításai">${icon("more")}</button></div>
      <div class="sets-table header"><span>SZETT</span><span>SÚLY</span><span>ISM.</span><span>RPE</span><span>MŰVELET</span></div>
      ${exercise.sets.map((set, setIndex) => `<div class="sets-table set-row ${set.done ? "completed" : ""}" data-exercise="${exerciseIndex}" data-set="${setIndex}"><span>${setIndex + 1}</span><label><input type="number" value="${set.weight}" data-field="weight" aria-label="Súly"><small>kg</small></label><label><input type="number" value="${set.reps}" data-field="reps" aria-label="Ismétlés"><small>ism.</small></label><label><input type="number" value="${set.rpe}" data-field="rpe" placeholder="—" aria-label="RPE"></label><div class="set-actions"><button class="set-check ${set.done ? "done" : ""}" aria-label="Sorozat kész">${icon("check")}</button><button class="delete-set" aria-label="Sorozat törlése" title="Sorozat törlése">${icon("trash")}</button></div></div>`).join("")}
    </article>`).join("");
  $$(".set-row", "#exerciseList").forEach(row => {
    const exerciseIndex = Number(row.dataset.exercise), setIndex = Number(row.dataset.set);
    $$("input", row).forEach(input => input.addEventListener("input", () => {
      activeWorkout.exercises[exerciseIndex].sets[setIndex][input.dataset.field] = input.value === "" ? "" : Number(input.value);
      markWorkoutSaving(); saveActiveWorkout(); refreshWorkoutSummary();
    }));
    $(".set-check", row).addEventListener("click", () => {
      const set = activeWorkout.exercises[exerciseIndex].sets[setIndex];
      set.done = !set.done; set.completedAt = set.done ? Date.now() : null;
      if (set.done) activeWorkout.restUntil = Date.now() + 90000;
      row.classList.toggle("completed", set.done); $(".set-check", row).classList.toggle("done", set.done);
      markWorkoutSaving(); saveActiveWorkout(); refreshWorkoutSummary();
    });
    $(".delete-set", row).addEventListener("click", () => {
      const exercise = activeWorkout.exercises[exerciseIndex];
      exercise.sets.splice(setIndex, 1);
      if (!exercise.sets.length) activeWorkout.exercises.splice(exerciseIndex, 1);
      markWorkoutSaving(); saveActiveWorkout(); renderWorkout();
      toast("Sorozat törölve", "A munkamenet az új sorozatszámmal folytatódik.");
    });
  });
  refreshWorkoutSummary();
}

function markWorkoutSaving() {
  $("#workoutSaveState").textContent = "Mentés...";
  setTimeout(() => { if ($("#workoutSaveState")) $("#workoutSaveState").textContent = "Mentve"; }, 350);
}

function refreshWorkoutSummary() {
  if (!activeWorkout) return;
  const totals = workoutTotals();
  $("#completedSets").textContent = `${totals.done} / ${totals.all}`;
  $("#totalVolume").textContent = `${formatNumber(totals.volume)} kg`;
  $("#workoutProgress").style.width = `${totals.all ? totals.done / totals.all * 100 : 0}%`;
  if (!totals.all) $("#workoutFooterState").textContent = "Nincs megmaradt sorozat. Az edzés megerősítéssel lezárható.";
  else if (totals.done === totals.all) $("#workoutFooterState").textContent = "Minden sorozat rögzítve — az edzés szabályosan lezárható.";
  else $("#workoutFooterState").textContent = `Még ${totals.all - totals.done} sorozat van hátra. Lezáráskor megerősítést kérünk.`;
  updateActiveWorkoutBanner();
}

function updateActiveWorkoutBanner() {
  const banner = $("#activeWorkoutBanner");
  banner.hidden = !activeWorkout;
  if (!activeWorkout) return;
  const client = getClient(activeWorkout.clientId), totals = workoutTotals();
  $("#activeWorkoutName").textContent = `${activeWorkout.name} • ${client?.name || "Edzett"}`;
  $("#activeWorkoutSummary").textContent = `${totals.done} / ${totals.all} sorozat • ${formatDuration(Math.max(0, Math.floor((Date.now() - activeWorkout.startedAt) / 1000)))}`;
}

function updateRuntime() {
  if (!activeWorkout) return;
  const elapsed = Math.max(0, Math.floor((Date.now() - activeWorkout.startedAt) / 1000));
  $("#workoutTimer").textContent = formatDuration(elapsed);
  if (activeWorkout.restUntil && activeWorkout.restUntil > Date.now() && $("#workoutModal").classList.contains("open")) {
    $("#workoutFooterState").textContent = `Pihenő: ${formatDuration(Math.ceil((activeWorkout.restUntil - Date.now()) / 1000))} • az adatok mentve`;
  } else if (activeWorkout.restUntil && activeWorkout.restUntil <= Date.now()) {
    activeWorkout.restUntil = null; saveActiveWorkout(); refreshWorkoutSummary();
  }
  updateActiveWorkoutBanner();
}

function openActiveWorkout() {
  if (!activeWorkout) return;
  renderWorkout(); openModal("#workoutModal");
}

$$("[data-start-workout]").forEach(button => button.addEventListener("click", () => startWorkout()));
$("#activeWorkoutBanner").addEventListener("click", openActiveWorkout);
$$("[data-close-workout]").forEach(button => button.addEventListener("click", () => {
  closeModal($("#workoutModal"));
  toast("Edzés minimalizálva", "Az időmérés és az automatikus mentés tovább fut.");
}));
$("#workoutNote").addEventListener("input", event => {
  if (!activeWorkout) return;
  activeWorkout.note = event.target.value; markWorkoutSaving(); saveActiveWorkout();
});
$("#addWorkoutExercise").addEventListener("click", () => {
  if (!activeWorkout) return;
  activeWorkout.exercises.push({ id: `exercise-extra-${Date.now()}`, name: "Plank", note: "Törzsstabilitás • 60 mp pihenő", sets: Array.from({ length: 3 }, () => ({ weight: 0, reps: 45, rpe: 8, done: false, completedAt: null })) });
  saveActiveWorkout(); renderWorkout(); toast("Gyakorlat hozzáadva", "Plank • 3 sorozat");
});

function openFinishConfirmation() {
  if (!activeWorkout) return;
  const totals = workoutTotals();
  const missing = totals.all - totals.done;
  $("#finishConfirmText").textContent = missing
    ? `${missing} sorozat még nincs teljesítve. Ha most lezárod, ezek kimaradtként kerülnek az edzéstörténetbe.`
    : "Minden megmaradt sorozat teljesült. A lezárás után az eredmény bekerül az edzett előzményeibe.";
  $("#finishConfirmSummary").innerHTML = `<span><b>${totals.done} / ${totals.all}</b>teljesített sorozat</span><span><b>${formatNumber(totals.volume)} kg</b>rögzített volumen</span><span><b>${formatDuration(Math.max(0, Math.floor((Date.now() - activeWorkout.startedAt) / 1000)))}</b>eltelt idő</span>`;
  openModal("#finishConfirmModal");
}

function completeWorkout() {
  if (!activeWorkout) return;
  const totals = workoutTotals();
  const client = getClient(activeWorkout.clientId);
  const duration = Math.max(1, Math.round((Date.now() - activeWorkout.startedAt) / 60000));
  const rpes = activeWorkout.exercises.flatMap(exercise => exercise.sets).map(set => Number(set.rpe)).filter(Boolean);
  if (client) {
    client.history.unshift({ date: new Date().toISOString().slice(0, 10), name: activeWorkout.name, duration, volume: totals.volume, sets: totals.done, plannedSets: totals.all, skippedSets: totals.all - totals.done, rpe: rpes.length ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1) : "—", note: activeWorkout.note });
    client.stats.sessions += 1; client.stats.streak += 1;
    if (activeWorkout.scheduledId) {
      const scheduled = client.upcoming.find(item => item.id === activeWorkout.scheduledId);
      if (scheduled) {
        scheduled.status = "completed";
        scheduled.completedAt = new Date().toISOString();
        scheduled.completedSets = totals.done;
        scheduled.plannedSets = totals.all;
      }
    }
    client.last = "Most fejeződött be";
    saveClients();
  }
  const completedName = `${client?.name || "Edzett"} • ${activeWorkout.name}`;
  activeWorkout = null; saveActiveWorkout(); closeModal($("#finishConfirmModal")); closeModal($("#workoutModal"));
  renderClients(); renderRecent(); renderCalendar();
  if (client && selectedClientId === client.id && $("#clientDetailView").classList.contains("active")) renderClientProfile(client);
  toast("Edzés lezárva", `${completedName} • ${totals.done}/${totals.all} sorozat • ${formatNumber(totals.volume)} kg.`);
}

$("#finishWorkout").addEventListener("click", openFinishConfirmation);
$("#cancelFinishWorkout").addEventListener("click", () => closeModal($("#finishConfirmModal")));
$("#confirmFinishWorkout").addEventListener("click", completeWorkout);

$("#globalSearch").addEventListener("keydown", event => {
  if (event.key === "Enter" && event.target.value.trim()) { showView("clients"); $("#clientSearch").value = event.target.value; renderClients(); }
});
$("#todayBtn").addEventListener("click", () => toast("Aktuális hét", "A naptár a július 13–19. közötti hetet mutatja."));
$("#prevWeek").addEventListener("click", () => { $("#weekLabel").textContent = "Július 6–12."; });
$("#nextWeek").addEventListener("click", () => { $("#weekLabel").textContent = "Július 20–26."; });
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  const finishConfirmModal = $("#finishConfirmModal");
  if (finishConfirmModal.classList.contains("open")) {
    closeModal(finishConfirmModal);
    return;
  }
  const workoutModal = $("#workoutModal");
  if (workoutModal.classList.contains("open")) {
    closeModal(workoutModal); toast("Edzés minimalizálva", "A munkamenet továbbra is aktív.");
  } else {
    $$(".modal-backdrop.open").forEach(closeModal);
  }
});
window.addEventListener("beforeunload", () => { if (activeWorkout) saveActiveWorkout(); });

updateClientCounts();
renderRecent();
renderClients();
renderPlans();
renderCalendar();
updateActiveWorkoutBanner();
setInterval(updateRuntime, 1000);
if (activeWorkout) setTimeout(() => { openActiveWorkout(); toast("Edzés visszaállítva", "A korábbi munkamenet pontosan onnan folytatódik, ahol abbamaradt."); }, 350);
