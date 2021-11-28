let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
	? JSON.parse(localStorage.getItem("events"))
	: [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

function openModal(date) {
	clicked = date;

	const eventForDay = events.find((e) => e.date === clicked);

	if (eventForDay) {
		document.getElementById("eventText").innerText = eventForDay.title;
		deleteEventModal.style.display = "block";
	} else {
		newEventModal.style.display = "block";
	}

	backDrop.style.display = "block";
}

function load() {
	const dt = new Date();

	if (nav !== 0) {
		dt.setMonth(new Date().getMonth() + nav);
	}

	const day = dt.getDate();
	const month = dt.getMonth();
	const year = dt.getFullYear();

	const firstDayOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
	const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

	document.getElementById(
		"monthDisplay"
	).innerText = `${dt.toLocaleDateString("en-us", {
		month: "long",
	})} ${year}`;

	calendar.innerHTML = "";

	for (let i = 1; i <= paddingDays + daysInMonth; i++) {
		const daySquare = document.createElement("div");
		daySquare.classList.add("day");

		const dayString = `${month + 1}/${i - paddingDays}/${year}`;

		if (i > paddingDays) {
			daySquare.innerText = i - paddingDays;
			const eventForDay = events.find((e) => e.date === dayString);

			if (i - paddingDays === day && nav === 0) {
				daySquare.id = "currentDay";
			}

			if (eventForDay) {
				const eventDiv = document.createElement("div");
				eventDiv.classList.add("event");
				eventDiv.innerText = eventForDay.title;
				daySquare.appendChild(eventDiv);
			}

			daySquare.addEventListener("click", () => openModal(dayString));
		} else {
			daySquare.classList.add("padding");
		}

		calendar.appendChild(daySquare);
	}
}

function closeModal() {
	eventTitleInput.classList.remove("error");
	newEventModal.style.display = "none";
	deleteEventModal.style.display = "none";
	backDrop.style.display = "none";
	eventTitleInput.value = "";
	clicked = null;
	load();
}

function saveEvent() {
	if (eventTitleInput.value) {
		eventTitleInput.classList.remove("error");

		events.push({
			date: clicked,
			title: eventTitleInput.value,
		});

		localStorage.setItem("events", JSON.stringify(events));
		closeModal();
	} else {
		eventTitleInput.classList.add("error");
	}
}

function deleteEvent() {
	events = events.filter((e) => e.date !== clicked);
	localStorage.setItem("events", JSON.stringify(events));
	closeModal();
}

function initButtons() {
	document.getElementById("nextButton").addEventListener("click", () => {
		nav++;
		load();
	});

	document.getElementById("backButton").addEventListener("click", () => {
		nav--;
		load();
	});

	document.getElementById("saveButton").addEventListener("click", saveEvent);
	document
		.getElementById("cancelButton")
		.addEventListener("click", closeModal);
	document
		.getElementById("deleteButton")
		.addEventListener("click", deleteEvent);
	document
		.getElementById("closeButton")
		.addEventListener("click", closeModal);
}

initButtons();
load();
const edit_tasks = document.querySelectorAll(".edit_task");
const form_edit = document.querySelector(".form_edit");
const button_edit = document.querySelector(".edit");
const disable_form = document.querySelectorAll(".disable_form");
const profile = document.querySelector(".profile_user");
const showed = document.querySelector(".showed");
const no_show = document.querySelector(".no_show");
const js_cancel_tasks = document.querySelectorAll(".js_cancel_task");
const js_cancel_profile = document.querySelector(".js_cancel_profile");
js_cancel_tasks.forEach((js_cancel_task) => {
	js_cancel_task.addEventListener("click", () => {
		console.log(js_cancel_task.parentElement);
		js_cancel_task.parentElement.classList.add("dis_active");
		js_cancel_task.parentElement.previousElementSibling.classList.remove(
			"dis_active"
		);
	});
});
js_cancel_profile.addEventListener("click", () => {
	console.log(js_cancel_profile);
	form_edit.classList.remove("active");
	button_edit.classList.remove("dis_active");
	profile.classList.remove("dis_active");
});
button_edit.addEventListener("click", () => {
	form_edit.classList.add("active");
	button_edit.classList.add("dis_active");
	profile.classList.add("dis_active");
});
disable_form.forEach((btn) => {
	btn.addEventListener("click", () => {
		form_edit.classList.remove("active");
		button_edit.classList.remove("dis_active");
		profile.classList.remove("dis_active");
	});
});
edit_tasks.forEach((edit_task) => {
	const a = edit_task;
	edit_task.addEventListener("click", () => {
		a.parentElement.parentElement.firstElementChild.classList.add(
			"dis_active"
		);
		a.parentElement.parentElement.firstElementChild.nextElementSibling.classList.remove(
			"dis_active"
		);
	});
});
