/* ════════════════════════════════════════════════════════════════
   main.js  –  Local Community Event Portal
   All 14 JavaScript Exercise Modules implemented here.
════════════════════════════════════════════════════════════════ */

/* ── MODULE 1: JavaScript Basics & Setup ──────────────────────
   • console.log welcome message
   • alert on page load
──────────────────────────────────────────────────────────────── */
console.log("Welcome to the Community Portal");

window.addEventListener("load", () => {
  // alert is shown once per session via sessionStorage to avoid annoyance
  if (!sessionStorage.getItem("alerted")) {
    alert("🎉 Welcome! The Community Event Portal has fully loaded. Explore upcoming events below!");
    sessionStorage.setItem("alerted", "true");
  }
});


/* ── MODULE 2: Syntax, Data Types, and Operators ─────────────
   • const for event name/date, let for seats
   • Template literals
   • ++ / -- seat management
──────────────────────────────────────────────────────────────── */

// Seat counter demo (used internally when users register/cancel)
function createSeatCounter(initial) {
  let seats = initial;
  return {
    register()  { seats--; return seats; },
    cancel()    { seats++; return seats; },
    get()       { return seats; },
    info(name, date) {
      return `📅 Event: "${name}" on ${date} — Seats remaining: ${seats}`;
    }
  };
}


/* ── MODULE 3: Conditionals, Loops, Error Handling ───────────
   • if-else to hide past / full events
   • forEach to iterate event list
   • try-catch in registration logic
──────────────────────────────────────────────────────────────── */

function isEventValid(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  if (eventDate < today) return false;   // past event
  if (event.seats <= 0)  return false;   // fully booked
  return true;
}


/* ── MODULE 4: Functions, Scope, Closures, HOFs ─────────────
   • addEvent(), registerUser(), filterEventsByCategory()
   • Closure tracking category registrations
   • Callbacks for dynamic filtering
──────────────────────────────────────────────────────────────── */

// Closure: tracks registrations per category
function makeCategoryTracker() {
  const counts = {};  // private via closure
  return {
    register(category) {
      counts[category] = (counts[category] || 0) + 1;
    },
    cancel(category) {
      if (counts[category]) counts[category] = Math.max(0, counts[category] - 1);
    },
    getCount(category) { return counts[category] || 0; },
    getAll()           { return { ...counts }; }
  };
}
const categoryTracker = makeCategoryTracker();

// Higher-order: pass a predicate callback for flexible filtering
function filterEventsByCategory(events, predicate) {
  return events.filter(predicate);
}

function addEvent(list, newEvent) {
  list.push(newEvent);
  return list;
}

function registerUser(event, userName) {
  try {
    if (!userName || userName.trim() === "") throw new Error("Name cannot be empty.");
    if (event.seats <= 0)                   throw new Error(`"${event.name}" is fully booked.`);
    event.counter.register();
    event.seats--;
    event.registeredUsers = event.registeredUsers || [];
    event.registeredUsers.push(userName);
    categoryTracker.register(event.category);
    return { success: true, message: `Registered ${userName} for "${event.name}".` };
  } catch (err) {
    return { success: false, message: err.message };
  }
}


/* ── MODULE 5: Objects and Prototypes ───────────────────────
   • Event constructor / class
   • checkAvailability() on prototype
   • Object.entries() for inspection
──────────────────────────────────────────────────────────────── */

class CommunityEvent {
  constructor({ id, name, date, location, category, seats, emoji = "📌", description = "" }) {
    this.id          = id;
    this.name        = name;
    this.date        = date;
    this.location    = location;
    this.category    = category;
    this.totalSeats  = seats;
    this.seats       = seats;
    this.emoji       = emoji;
    this.description = description;
    this.registeredUsers = [];
    this.counter     = createSeatCounter(seats);  // Module 2 counter
  }

  // Prototype method
  checkAvailability() {
    if (this.seats <= 0)       return "Fully Booked 🔴";
    if (this.seats <= 3)       return "Almost Full 🟡";
    return "Available 🟢";
  }

  // For template literals
  getSummary() {
    return `${this.emoji} ${this.name} | ${this.date} @ ${this.location} — ${this.checkAvailability()}`;
  }

  getEntries() {
    return Object.entries({
      name: this.name,
      date: this.date,
      location: this.location,
      category: this.category,
      seats: this.seats,
      availability: this.checkAvailability()
    });
  }
}


/* ── MODULE 6: Arrays and Methods ───────────────────────────
   • .push() to add events
   • .filter() for category filtering
   • .map() to format display cards
──────────────────────────────────────────────────────────────── */

// Seed data — Module 6: .push() demonstrates addEvent()
let eventsData = [
  new CommunityEvent({ id: 1,  name: "Jazz in the Park",         date: "2025-09-12", location: "downtown",  category: "music",    seats: 80,  emoji: "🎷", description: "An evening of smooth jazz under the open sky." }),
  new CommunityEvent({ id: 2,  name: "Sourdough Baking Workshop", date: "2025-09-18", location: "north",     category: "workshop", seats: 12,  emoji: "🍞", description: "Learn the art of artisan sourdough from a local baker." }),
  new CommunityEvent({ id: 3,  name: "Sunday 5K Fun Run",         date: "2025-09-21", location: "west",      category: "sports",   seats: 200, emoji: "🏃", description: "Community fun run through West Park trails." }),
  new CommunityEvent({ id: 4,  name: "Street Food Festival",      date: "2025-09-27", location: "downtown",  category: "food",     seats: 500, emoji: "🍕", description: "50+ vendors, live cooking demos, and tastings." }),
  new CommunityEvent({ id: 5,  name: "Watercolour for Beginners", date: "2025-10-05", location: "east",      category: "art",      seats: 20,  emoji: "🎨", description: "A relaxed intro to watercolour painting." }),
  new CommunityEvent({ id: 6,  name: "AI & You – Tech Talk",      date: "2025-10-10", location: "north",     category: "tech",     seats: 60,  emoji: "🤖", description: "Panel discussion on AI's impact on everyday life." }),
  new CommunityEvent({ id: 7,  name: "Indie Acoustic Night",      date: "2025-10-15", location: "east",      category: "music",    seats: 45,  emoji: "🎸", description: "Three local singer-songwriters, one cozy venue." }),
  new CommunityEvent({ id: 8,  name: "Pottery Wheel Session",     date: "2025-10-20", location: "west",      category: "workshop", seats: 3,   emoji: "🏺", description: "Try the pottery wheel under expert guidance." }),
  new CommunityEvent({ id: 9,  name: "Youth Football League",     date: "2025-10-25", location: "west",      category: "sports",   seats: 30,  emoji: "⚽", description: "Registration open for autumn season matches." }),
  new CommunityEvent({ id: 10, name: "Farm-to-Table Dinner",      date: "2025-11-01", location: "north",     category: "food",     seats: 40,  emoji: "🥗", description: "Seasonal menu, local produce, candlelit setting." }),
];

// Module 6: push a dynamically added event
addEvent(eventsData, new CommunityEvent({
  id: 11, name: "Open Mic Comedy Night", date: "2025-11-08",
  location: "downtown", category: "music", seats: 70, emoji: "🎤",
  description: "Local comedians take the stage — anything can happen!"
}));

// Log Object.entries() example for one event (Module 5)
console.table(eventsData[0].getEntries());

// Module 6: .map() formats display labels
function formatCardTitle(event) {
  const typeTitles = { workshop: "Workshop on", music: "Live Music:", sports: "Sports Event:", food: "Food Event:", art: "Art Session:", tech: "Tech Talk:" };
  const prefix = typeTitles[event.category] || "Event:";
  return `${prefix} ${event.name}`;
}


/* ── MODULE 7: DOM Manipulation ─────────────────────────────
   • querySelector() to access elements
   • createElement() & appendChild() to build cards
   • Update UI on register / cancel
──────────────────────────────────────────────────────────────── */

const eventsGrid   = document.querySelector("#eventsGrid");
const noEventsMsg  = document.querySelector("#noEventsMsg");
const regEventSel  = document.querySelector("#regEvent");
const statsGrid    = document.querySelector("#statsGrid");

// Banner gradient per category
const categoryGradients = {
  music:    "linear-gradient(90deg, #7b61ff, #b45cff)",
  workshop: "linear-gradient(90deg, #f5a623, #ff9a44)",
  sports:   "linear-gradient(90deg, #3ecf8e, #00d4aa)",
  food:     "linear-gradient(90deg, #e84393, #ff6b9d)",
  art:      "linear-gradient(90deg, #ff6b6b, #ff8e53)",
  tech:     "linear-gradient(90deg, #00d4ff, #7b61ff)",
};

function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.dataset.id = event.id;

  const seatPct   = Math.round((event.seats / event.totalSeats) * 100);
  const fillClass = seatPct <= 20 ? "low" : seatPct <= 60 ? "mid" : "high";
  const available = isEventValid(event);  // Module 3

  // Banner
  const banner = document.createElement("div");
  banner.className = "card-banner";
  banner.style.background = categoryGradients[event.category] || "#444";

  // Body
  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <div class="card-tags">
      <span class="tag cat-${event.category}">${event.emoji} ${event.category}</span>
      <span class="tag">${event.location}</span>
    </div>
    <h3 class="card-title">${formatCardTitle(event)}</h3>
    <p class="card-description" style="font-size:0.84rem;color:var(--muted);line-height:1.5;">${event.description}</p>
    <div class="card-meta">
      <span>📅 ${formatDate(event.date)}</span>
      <span>📍 ${capitalise(event.location)}</span>
      <span>🪑 ${event.checkAvailability()}</span>
    </div>
    <div class="seats-bar"><div class="seats-fill ${fillClass}" style="width:${seatPct}%"></div></div>
    <p class="seats-label">${event.seats} / ${event.totalSeats} seats remaining</p>
  `;

  // Footer
  const footer = document.createElement("div");
  footer.className = "card-footer";

  const regBtn = document.createElement("button");
  regBtn.className = "btn-register";
  regBtn.textContent = available ? "Register" : "Unavailable";
  regBtn.disabled = !available;
  // Module 8: onclick
  regBtn.onclick = () => handleRegister(event, card, regBtn, cancelBtn, badge);

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn-cancel";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => handleCancel(event, card, regBtn, cancelBtn, badge);

  const badge = document.createElement("span");
  badge.className = "registered-badge";
  badge.textContent = "✓ Registered";

  footer.appendChild(regBtn);
  footer.appendChild(cancelBtn);
  footer.appendChild(badge);

  card.appendChild(banner);
  card.appendChild(body);
  card.appendChild(footer);
  return card;
}

function renderEvents(list) {
  eventsGrid.innerHTML = "";

  const visible = list.filter(e => isEventValid(e));  // Module 3
  if (visible.length === 0) {
    noEventsMsg.style.display = "block";
    return;
  }
  noEventsMsg.style.display = "none";

  // Module 6: forEach
  visible.forEach((event, idx) => {
    const card = createEventCard(event);
    card.style.animationDelay = `${idx * 0.06}s`;
    eventsGrid.appendChild(card);     // Module 7: appendChild
  });
}

function refreshCard(event, card) {
  // Module 7: Update UI dynamically
  const seatsLabel = card.querySelector(".seats-label");
  const seatsFill  = card.querySelector(".seats-fill");
  if (seatsLabel) {
    const seatPct   = Math.round((event.seats / event.totalSeats) * 100);
    const fillClass = seatPct <= 20 ? "low" : seatPct <= 60 ? "mid" : "high";
    seatsLabel.textContent = `${event.seats} / ${event.totalSeats} seats remaining`;
    seatsFill.style.width = `${seatPct}%`;
    seatsFill.className = `seats-fill ${fillClass}`;
  }
  const availSpan = card.querySelectorAll(".card-meta span")[2];
  if (availSpan) availSpan.textContent = `🪑 ${event.checkAvailability()}`;
  updateStats();
  populateEventDropdown();
}

function handleRegister(event, card, regBtn, cancelBtn, badge) {
  // Module 3: try-catch
  const result = registerUser(event, "Portal User");
  if (result.success) {
    regBtn.disabled = true;
    regBtn.textContent = "Registered";
    cancelBtn.classList.add("visible");
    badge.classList.add("show");
    refreshCard(event, card);
    showToast(`✅ Registered for "${event.name}"!`);
    console.log(event.counter.info(event.name, event.date)); // Module 2 template literal
  } else {
    showToast(result.message, true);
  }
}

function handleCancel(event, card, regBtn, cancelBtn, badge) {
  event.seats++;
  event.counter.cancel();            // Module 2: -- operator internally
  categoryTracker.cancel(event.category);
  if (event.registeredUsers) event.registeredUsers.pop();
  regBtn.disabled = false;
  regBtn.textContent = "Register";
  cancelBtn.classList.remove("visible");
  badge.classList.remove("show");
  refreshCard(event, card);
  showToast(`↩️ Registration cancelled for "${event.name}".`);
}


/* ── MODULE 8: Event Handling ────────────────────────────────
   • onclick (register buttons – see above)
   • onchange for category & location filters
   • keydown for search
──────────────────────────────────────────────────────────────── */

const categoryFilter = document.querySelector("#categoryFilter");
const locationFilter = document.querySelector("#locationFilter");
const searchInput    = document.querySelector("#searchInput");

function getFilteredEvents() {
  const cat    = categoryFilter.value;
  const loc    = locationFilter.value;
  const query  = searchInput.value.trim().toLowerCase();

  // Module 10: spread operator to clone before filtering
  return [...eventsData].filter(e => {
    const catMatch  = cat   === "all" || e.category === cat;
    const locMatch  = loc   === "all" || e.location === loc;
    const nameMatch = query === "" || e.name.toLowerCase().includes(query);
    return catMatch && locMatch && nameMatch;
  });
}

// Module 8: onchange
categoryFilter.onchange = () => renderEvents(getFilteredEvents());
locationFilter.onchange = () => renderEvents(getFilteredEvents());

// Module 8: keydown search
searchInput.addEventListener("keydown", () => {
  // slight debounce so it feels natural
  clearTimeout(searchInput._timer);
  searchInput._timer = setTimeout(() => renderEvents(getFilteredEvents()), 180);
});


/* ── MODULE 9: Async JS, Promises, Async/Await ───────────────
   • Mock API fetch using a local JSON blob URL
   • .then() / .catch() version + async/await version
   • Loading spinner shown during fetch
──────────────────────────────────────────────────────────────── */

// Build a mock JSON endpoint from our data (Blob URL simulates remote API)
function buildMockAPI() {
  const json = JSON.stringify({ events: eventsData.map(e => ({
    id: e.id, name: e.name, date: e.date,
    location: e.location, category: e.category, seats: e.seats
  }))});
  return URL.createObjectURL(new Blob([json], { type: "application/json" }));
}

// Promise/.then() version
function fetchEventsPromise(url) {
  const spinner = document.querySelector("#loadingSpinner");
  spinner.style.display = "block";
  eventsGrid.style.display = "none";

  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      console.log("📡 Events fetched (Promise style):", data.events.length, "events");
    })
    .catch(err => {
      console.error("Fetch error:", err);
    })
    .finally(() => {
      spinner.style.display = "none";
      eventsGrid.style.display = "grid";
    });
}

// Async/Await version (used on load)
async function fetchEventsAsync(url) {
  const spinner = document.querySelector("#loadingSpinner");
  spinner.style.display = "block";
  eventsGrid.style.display = "none";
  noEventsMsg.style.display = "none";

  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    console.log("📡 Events fetched (async/await style):", data.events.length, "events");

    // Simulate a realistic loading delay (setTimeout)
    await new Promise(resolve => setTimeout(resolve, 900));
  } catch (err) {
    console.error("Async fetch error:", err);
    showToast("Could not load events from API. Showing local data.", true);
  } finally {
    spinner.style.display = "none";
    eventsGrid.style.display = "grid";
    renderEvents(eventsData);
    populateEventDropdown();
    updateStats();
  }
}


/* ── MODULE 10: Modern JavaScript Features (ES6+) ────────────
   • let, const, default params, destructuring, spread
──────────────────────────────────────────────────────────────── */

// Default parameters
function formatDate(dateStr, locale = "en-GB", options = { day: "numeric", month: "short", year: "numeric" }) {
  return new Date(dateStr).toLocaleDateString(locale, options);
}

// Destructuring event details
function logEventDetails({ name, date, location, category, seats }) {
  console.log(`[Event] ${name} | ${date} | ${location} | ${category} | Seats: ${seats}`);
}

// Spread: clone before operating (already used in getFilteredEvents())
const clonedForLog = [...eventsData];
logEventDetails(clonedForLog[0]);

function capitalise(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/* ── MODULE 11: Working with Forms ───────────────────────────
   • form.elements to capture inputs
   • event.preventDefault()
   • Inline validation
──────────────────────────────────────────────────────────────── */

const form        = document.querySelector("#registrationForm");
const feedback    = document.querySelector("#formFeedback");

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.classList.remove("show"));
  document.querySelectorAll(".form-group input, .form-group select").forEach(el => el.classList.remove("error"));
  feedback.style.display = "none";
}

function showFieldError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input)  input.classList.add("error");
  if (error)  { error.textContent = msg; error.classList.add("show"); }
}

function validateForm(elements) {
  clearErrors();
  let valid = true;
  const name  = elements.namedItem("name").value.trim();
  const email = elements.namedItem("email").value.trim();
  const event = elements.namedItem("event").value;
  const terms = elements.namedItem("terms").checked;

  if (!name) {
    showFieldError("regName", "nameError", "Full name is required.");
    valid = false;
  } else if (name.length < 2) {
    showFieldError("regName", "nameError", "Name must be at least 2 characters.");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showFieldError("regEmail", "emailError", "Email address is required.");
    valid = false;
  } else if (!emailRegex.test(email)) {
    showFieldError("regEmail", "emailError", "Please enter a valid email.");
    valid = false;
  }

  if (!event) {
    showFieldError("regEvent", "eventError", "Please select an event.");
    valid = false;
  }

  if (!terms) {
    const err = document.getElementById("termsError");
    err.textContent = "You must agree to the community guidelines.";
    err.classList.add("show");
    valid = false;
  }

  return { valid, name, email, event };
}

function populateEventDropdown() {
  const sel = document.querySelector("#regEvent");
  const current = sel.value;
  sel.innerHTML = '<option value="">— Choose an event —</option>';
  eventsData.filter(isEventValid).forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = `${e.emoji} ${e.name} (${formatDate(e.date)})`;
    sel.appendChild(opt);
  });
  sel.value = current;
}


/* ── MODULE 12: AJAX & Fetch API ─────────────────────────────
   • POST user data to mock API (via fetch)
   • Show success / failure message
   • setTimeout to simulate delayed response
──────────────────────────────────────────────────────────────── */

// Mock POST endpoint (Blob URL)
function buildPostMockAPI() {
  // We'll intercept and simulate instead of real POST
  return "https://httpbin.org/post";   // public echo server
}

async function submitRegistrationToAPI(payload) {
  // Simulate a delayed server response with setTimeout
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Simulate 90% success rate
  if (Math.random() > 0.1) {
    return { ok: true, data: { message: "Registration confirmed", id: Math.floor(Math.random() * 90000 + 10000) } };
  } else {
    throw new Error("Server error. Please try again.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();   // Module 11

  const { valid, name, email, event: eventId } = validateForm(form.elements);
  if (!valid) return;

  const submitBtn = form.querySelector("#registerBtn");
  submitBtn.textContent = "Submitting…";
  submitBtn.disabled = true;

  const selectedEvent = eventsData.find(ev => ev.id === Number(eventId));
  const payload = { name, email, eventId, eventName: selectedEvent?.name, timestamp: new Date().toISOString() };

  console.log("📤 Submitting registration:", payload);  // Module 13: log steps

  try {
    const result = await submitRegistrationToAPI(payload);

    // Module 7: update UI on success
    feedback.className = "form-feedback success";
    feedback.textContent = `🎉 Success! You're registered for "${selectedEvent?.name}". Confirmation #${result.data.id}`;
    feedback.style.display = "block";

    // Register via Module 4 logic too
    if (selectedEvent) {
      const regResult = registerUser(selectedEvent, name);
      console.log("Registration result:", regResult.message);  // Module 13
      renderEvents(getFilteredEvents());
    }

    form.reset();
    showToast(`✅ ${name}, you're all set for "${selectedEvent?.name}"!`);
  } catch (err) {
    feedback.className = "form-feedback error";
    feedback.textContent = `❌ ${err.message}`;
    feedback.style.display = "block";
    console.error("Submission error:", err);  // Module 13
  } finally {
    submitBtn.textContent = "Reserve My Spot";
    submitBtn.disabled = false;
  }
});


/* ── MODULE 13: Debugging & Testing ─────────────────────────
   • Console logs throughout for Dev Tools inspection
   • Step-by-step registration logging
   • Descriptive labels so Network/Console are readable
──────────────────────────────────────────────────────────────── */

// Utility: log all event objects for DevTools inspection
console.groupCollapsed("📋 All Community Events (Module 13 – Debug View)");
eventsData.forEach(e => console.log(`[${e.id}] ${e.getSummary()}`));
console.groupEnd();

// Expose helpers to window for manual DevTools testing
window.__portal = {
  events:          eventsData,
  tracker:         categoryTracker,
  filterByCategory: filterEventsByCategory,
  addEvent,
  registerUser,
  isEventValid
};
console.log("🛠️  DevTools: window.__portal exposes events, tracker, addEvent, registerUser, etc.");


/* ── MODULE 14: jQuery & JS Frameworks ───────────────────────
   • $('#registerBtn').click() to handle click
   • .fadeIn() / .fadeOut() for event cards
   • Framework note logged to console
──────────────────────────────────────────────────────────────── */

$(document).ready(function () {
  // jQuery click handler on register button
  $("#registerBtn").click(function () {
    // Log step for debugging (Module 13)
    console.log("🔵 jQuery: #registerBtn clicked — form submission triggered.");
    // Actual submission handled by native submit event above; jQuery mirrors it
  });

  // jQuery: fadeIn animation for event cards on page load (called after async render)
  function jqueryFadeInCards() {
    $(".event-card").hide().each(function (i) {
      const $card = $(this);
      setTimeout(() => $card.fadeIn(400), i * 80);
    });
  }

  // Expose so we can call after render
  window.__jqueryFadeInCards = jqueryFadeInCards;

  // Module 14: Framework note
  console.log(
    "💡 Framework Note (Module 14): jQuery simplifies DOM queries and animations, " +
    "but modern frameworks like React or Vue take it further by introducing component-based " +
    "architecture, reactive state management, and virtual DOM — making large-scale UIs far " +
    "easier to maintain, test, and scale."
  );
});


/* ── STATS PANEL (uses Closure tracker – Module 4) ──────────
──────────────────────────────────────────────────────────────── */

function updateStats() {
  const counts = categoryTracker.getAll();
  const total  = Object.values(counts).reduce((a, b) => a + b, 0);
  const upcoming = eventsData.filter(isEventValid).length;

  const statItems = [
    { label: "Total Events",       value: eventsData.length },
    { label: "Upcoming Events",    value: upcoming },
    { label: "Total Registrations",value: total },
    ...Object.entries(counts).map(([cat, n]) => ({ label: `${capitalise(cat)} Regs`, value: n }))
  ];

  statsGrid.innerHTML = "";
  statItems.forEach(({ label, value }) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `<div class="stat-number">${value}</div><div class="stat-label">${label}</div>`;
    statsGrid.appendChild(card);
  });
}


/* ── TOAST NOTIFICATION ──────────────────────────────────────
──────────────────────────────────────────────────────────────── */

// Create toast element
const toast = document.createElement("div");
toast.id = "toast";
document.body.appendChild(toast);

let toastTimer;
function showToast(msg, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className = isError ? "error-toast show" : "show";
  toastTimer = setTimeout(() => { toast.className = isError ? "error-toast" : ""; }, 3500);
}


/* ── INITIALISE ─────────────────────────────────────────────
──────────────────────────────────────────────────────────────── */

(async function init() {
  const mockURL = buildMockAPI();
  await fetchEventsAsync(mockURL);   // Module 9: async/await + spinner

  // After render, apply jQuery fadeIn (Module 14)
  if (typeof window.__jqueryFadeInCards === "function") {
    window.__jqueryFadeInCards();
  }

  // Also demonstrate promise/.then() version in console
  fetchEventsPromise(buildMockAPI()).then(() => {
    console.log("✅ Promise-based fetch also completed.");
  });
})();
