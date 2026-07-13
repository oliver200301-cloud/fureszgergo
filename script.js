const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const calendarGrid = document.querySelector("#calendarGrid");
const calendarRange = document.querySelector("#calendarRange");
const selectedSlotText = document.querySelector("#selectedSlotText");
const bookingForm = document.querySelector("#bookingForm");
const bookingNote = document.querySelector("#bookingNote");
const prevWeekButton = document.querySelector("#prevWeek");
const nextWeekButton = document.querySelector("#nextWeek");

const bookingStorageKey = "furesz-gergo-bookings";
const trainerEmail = "fireszgergo8@gmail.com";
const dayNames = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
const monthFormatter = new Intl.DateTimeFormat("hu-HU", { month: "short", day: "numeric" });
const fullDateFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

let currentWeekStart = getMonday(new Date());
let selectedSlot = null;

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(bookingStorageKey)) || {};
  } catch {
    return {};
  }
}

function saveBookings(bookings) {
  localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
}

function getMonday(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay() || 7;
  next.setDate(next.getDate() - day + 1);
  return next;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function formatHour(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function isPastSlot(date, hour) {
  const slotDate = new Date(date);
  slotDate.setHours(hour, 0, 0, 0);
  return slotDate < new Date();
}

function buildBookingEmail(slot, data) {
  const subject = `Új edzés foglalási kérés - ${slot.dateKey} ${formatHour(slot.hour)}`;
  const body = [
    "Szia Gergő!",
    "",
    "Új személyi edzés foglalási kérés érkezett:",
    "",
    `Időpont: ${slot.label}`,
    `Név: ${data.name}`,
    `Telefonszám: ${data.phone}`,
    `Email: ${data.email || "Nincs megadva"}`,
    `Cél: ${data.goal || "Nincs megadva"}`,
    "",
    "Kérlek igazold vissza az időpontot."
  ].join("\n");

  return `mailto:${trainerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderCalendar() {
  if (!calendarGrid || !calendarRange) {
    return;
  }

  const bookings = getBookings();
  const weekEnd = addDays(currentWeekStart, 6);
  calendarRange.textContent = `${monthFormatter.format(currentWeekStart)} - ${monthFormatter.format(weekEnd)}`;
  calendarGrid.innerHTML = "";

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const date = addDays(currentWeekStart, dayIndex);
    const dateKey = toDateKey(date);
    const dayColumn = document.createElement("div");
    dayColumn.className = "calendar-day";

    const header = document.createElement("div");
    header.className = "calendar-day-header";
    header.innerHTML = `<strong>${dayNames[dayIndex]}</strong><span>${monthFormatter.format(date)}</span>`;
    dayColumn.appendChild(header);

    for (let hour = 8; hour < 21; hour += 1) {
      const slotKey = `${dateKey}-${formatHour(hour)}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot-button";
      button.textContent = formatHour(hour);
      button.dataset.date = dateKey;
      button.dataset.hour = String(hour);
      button.dataset.slotKey = slotKey;

      if (bookings[slotKey]) {
        button.classList.add("is-booked");
        button.disabled = true;
        button.title = "Ez az időpont már foglalt.";
      } else if (isPastSlot(date, hour)) {
        button.classList.add("is-past");
        button.disabled = true;
        button.title = "Múltbeli időpont nem foglalható.";
      } else if (selectedSlot?.slotKey === slotKey) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        selectedSlot = {
          slotKey,
          dateKey,
          hour,
          label: `${fullDateFormatter.format(date)}, ${formatHour(hour)}-${formatHour(hour + 1)}`
        };
        selectedSlotText.textContent = selectedSlot.label;
        bookingNote.textContent = "Töltsd ki az adataidat, majd rögzítsd a foglalási kérést.";
        renderCalendar();
      });

      dayColumn.appendChild(button);
    }

    calendarGrid.appendChild(dayColumn);
  }
}

prevWeekButton?.addEventListener("click", () => {
  currentWeekStart = addDays(currentWeekStart, -7);
  selectedSlot = null;
  selectedSlotText.textContent = "Válassz egy szabad időpontot a naptárból.";
  renderCalendar();
});

nextWeekButton?.addEventListener("click", () => {
  currentWeekStart = addDays(currentWeekStart, 7);
  selectedSlot = null;
  selectedSlotText.textContent = "Válassz egy szabad időpontot a naptárból.";
  renderCalendar();
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedSlot) {
    bookingNote.textContent = "Először válassz ki egy szabad időpontot a naptárból.";
    return;
  }

  const formData = new FormData(bookingForm);
  const bookingData = {
    date: selectedSlot.dateKey,
    hour: selectedSlot.hour,
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    goal: formData.get("goal"),
    createdAt: new Date().toISOString()
  };
  const bookings = getBookings();
  bookings[selectedSlot.slotKey] = bookingData;
  saveBookings(bookings);

  const mailtoLink = buildBookingEmail(selectedSlot, bookingData);
  bookingNote.textContent = `Foglalási kérés rögzítve: ${selectedSlot.label}. Megnyitom az előkészített emailt Gergőnek.`;
  window.location.href = mailtoLink;
  bookingForm.reset();
  selectedSlot = null;
  selectedSlotText.textContent = "Válassz egy új szabad időpontot a naptárból.";
  renderCalendar();
});

renderCalendar();
