let nav = 0;
let clicked = null;
const item_list = document.getElementById("item_list").value;
const full_item_list = document.getElementById("full_item_list").value;
let a = item_list.replace("[", "");
a = a.replace("]", "");
a = a.replace(/'/g, "");
a = a.split(",");
let b = full_item_list.replace("[", "");
b = b.replace("]", "");
b = b.replace(/'/g, "");
b = b.split(",");
console.log(b);
console.log(typeof b);
let events = localStorage.getItem("events")
	? JSON.parse(localStorage.getItem("events"))
	: [];
console.log(typeof events);
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

	const eventForDay = a.find((e) => e.replace(/ /g, "") === clicked);
	let content = ``;
	if (eventForDay) {
		for (item of b) {
			let c = item.includes(clicked);
			if (c) {
				d = String(item).split("|")[1];
				e = String(item).split("|")[2];
				f = String(item).split("|")[3];
				content += `<div class="box" style="position:relative;">
				<div class="flip-card active">
					<div class="flip-card-inner">
						<div class="front">
							<div class="card text-white bg-info mb-3 shadow" style="max-width: 95%;">
								<div class="card-header">Title</div>
								<div class="card-body">					
									<p class="card-text">${d}</p>
								</div>
							</div>					
						</div>
						<div class="back">
							<div class="card text-white bg-primary mb-3 shadow" style="max-width: 95%;">
								<div class="card-header">Detail</div>
								<div class="card-body">					
									<p class="card-text">${e}</p>
								</div>
							</div>					
				  		</div>
					</div>
			  	</div>
				<div class="form_update" style="margin-bottom:10px">
					<form method="POST" action="/update/${f}">
						<input type="text" class="form-control" id="exampleFormControlInput1" name="title_update" value="${d}" >
						<input type="text" class="form-control" id="exampleFormControlInput1" name="detail_update" value="${e}" >
						<input type="datetime-local" id="date" name="date_update" />
						<div class="btn-group" role="group" aria-label="Basic outlined example">
							<button type="button" class="btn btn-outline-primary cancel_js">Cancel</button>  						
							<button type="submit" class="btn btn-outline-primary">Save</button>
						</div>
					</form>
				</div>				
				<form method="POST" action="/delete/${f}">
					<button class="deleteTask" type="submit" style="border:none;background-color:#e8f4fa;position:absolute;top:1px;right:-20px;font-size:20px"><i class="bi bi-x-lg"></i></button>
				</form>
				
				<button class="updateTask" style="border:none;background-color:#e8f4fa;position:absolute;top:40px;right:-20px;font-size:20px"><i class="bi bi-pencil-square"></i></button>
				
			  </div>`;
			}
		}
		document.getElementById("eventText").innerHTML = content;
		deleteEventModal.style.display = "block";
		const updatebtns = document.querySelectorAll(".updateTask");
		updatebtns.forEach((updatebtn) => {
			console.log("ok");
			updatebtn.addEventListener("click", () => {
				updatebtn.parentElement.firstElementChild.classList.remove(
					"active"
				);
				updatebtn.parentElement.firstElementChild.nextElementSibling.classList.add(
					"active"
				);
			});
		});
		const cancelbtns = document.querySelectorAll(".cancel_js");
		cancelbtns.forEach((cancelbtn) => {
			console.log("ok");
			cancelbtn.addEventListener("click", () => {
				cancelbtn.parentElement.parentElement.parentElement.classList.remove(
					"active"
				);
				cancelbtn.parentElement.parentElement.parentElement.previousElementSibling.classList.add(
					"active"
				);
			});
		});
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
			const eventForDay = a.find(
				(e) => e.replace(/ /g, "") === dayString
			);

			if (i - paddingDays === day && nav === 0) {
				daySquare.id = "currentDay";
			}

			if (eventForDay) {
				// const eventDiv = document.createElement("div");
				// eventDiv.classList.add("event");
				// eventDiv.innerText = eventForDay.title;
				// daySquare.appendChild(eventDiv);
				daySquare.classList.add("taskDay");
			}

			daySquare.addEventListener("click", () => openModal(dayString));
			// console.log(dayString);
		} else {
			daySquare.classList.add("padding");
		}

		calendar.appendChild(daySquare);
	}
}

function closeModal() {
	//eventTitleInput.classList.remove("error");
	newEventModal.style.display = "none";
	deleteEventModal.style.display = "none";
	backDrop.style.display = "none";
	//eventTitleInput.value = "";
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

	document
		.getElementById("cancelButton")
		.addEventListener("click", closeModal);
	// document
	// 	.getElementById("deleteButton")
	// 	.addEventListener("click", deleteEvent);
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
