var a = "{{username}}";
console.log(a);
const todos = document.querySelectorAll(".todo");
const all_status = document.querySelectorAll(".status");
const myForm = document.getElementById("myForm");
let draggableTodo = null;

todos.forEach((todo) => {
	todo.addEventListener("dragstart", dragStart);
	todo.addEventListener("dragend", dragEnd);
});

function dragStart() {
	draggableTodo = this;
	setTimeout(() => {
		this.style.display = "none";
	}, 0);
	console.log("dragStart");
}

function dragEnd() {
	draggableTodo = null;
	setTimeout(() => {
		this.style.display = "block";
	}, 0);
	console.log("dragEnd");
}

all_status.forEach((status) => {
	status.addEventListener("dragover", dragOver);
	status.addEventListener("dragenter", dragEnter);
	status.addEventListener("dragleave", dragLeave);
	status.addEventListener("drop", dragDrop);
});

function dragOver(e) {
	e.preventDefault();
	//   console.log("dragOver");
}

function dragEnter() {
	this.style.border = "1px dashed #ccc";
	console.log("dragEnter");
}

function dragLeave() {
	this.style.border = "none";
	console.log("dragLeave");
}

function dragDrop() {
	this.style.border = "none";
	this.appendChild(draggableTodo);
	console.log("dropped");
	var form2 = document.createElement("form");
	form2.method = "POST";
	const id = draggableTodo.firstElementChild.value;
	form2.action = `/updateprocess/${id}`;
	var inputElem = document.createElement("input");
	inputElem.type = "hidden";
	inputElem.name = "csrfmiddlewaretoken";
	inputElem.value = "{{% csrf_token %}}";
	form2.appendChild(inputElem);
	var element3 = document.createElement("input");
	element3.value = this.id;
	element3.name = "process_id";
	form2.appendChild(element3);
	document.body.appendChild(form2);
	form2.submit();
}

/* modal */
const btns = document.querySelectorAll("[data-target-modal]");
const close_modals = document.querySelectorAll(".close-modal");
const overlay = document.getElementById("overlay");

btns.forEach((btn) => {
	btn.addEventListener("click", () => {
		document.querySelector(btn.dataset.targetModal).classList.add("active");
		overlay.classList.add("active");
	});
});

close_modals.forEach((btn) => {
	btn.addEventListener("click", () => {
		const modal = btn.closest(".modal");
		modal.classList.remove("active");
		overlay.classList.remove("active");
	});
});

window.onclick = (event) => {
	if (event.target == overlay) {
		const modals = document.querySelectorAll(".modal");
		modals.forEach((modal) => modal.classList.remove("active"));
		overlay.classList.remove("active");
	}
};

/* create todo  */
const todo_submit = document.getElementById("todo_submit");

todo_submit.addEventListener("click", createTodo);

function createTodo() {
	console.log("ok");
	const input_val = document.getElementById("todo_input").value;
	var form = document.createElement("form");
	var element1 = document.createElement("input");
	var element2 = document.createElement("input");
	var element3 = document.createElement("input");
	var element4 = document.createElement("input");
	form.method = "POST";
	form.action = "/createprocess/";
	var inputElem = document.createElement("input");
	inputElem.type = "hidden";
	inputElem.name = "csrfmiddlewaretoken";
	inputElem.value = "{{% csrf_token %}}";
	form.appendChild(inputElem);
	const username = document.querySelector(".username_js").value;
	console.log(username);
	element1.value = username;
	element1.name = "username";
	form.appendChild(element1);
	const title = document.querySelector(".title_js").value;
	console.log(title);
	element2.value = title;
	element2.name = "title";
	form.appendChild(element2);

	element3.value = 0;
	element3.name = "process_id";
	form.appendChild(element3);

	element4.value = input_val;
	element4.name = "content";
	form.appendChild(element4);
	document.body.appendChild(form);

	form.submit();
}

const close_btns = document.querySelectorAll(".close");

close_btns.forEach((btn) => {
	btn.addEventListener("click", () => {
		var form1 = document.createElement("form");
		form1.method = "POST";
		const id = btn.parentElement.firstElementChild.value;
		form1.action = `/deleteprocess/${id}`;
		var inputElem = document.createElement("input");
		inputElem.type = "hidden";
		inputElem.name = "csrfmiddlewaretoken";
		inputElem.value = "{{% csrf_token %}}";
		form1.appendChild(inputElem);
		document.body.appendChild(form1);
		form1.submit();
		btn.parentElement.style.display = "none";
	});
});
