handleFullScreen();
var textInput = document.getElementById("textInput");
var widthInput = document.getElementById("widthInput");
var colorInput = document.getElementById("colorInput");
var invertColorChkbx = document.getElementById("invertColorChkbx");

function handleFullScreen() {
	let params = new URLSearchParams(document.location.search);
	let isFullScreen = params.get("fullscreen") === "true";
	if (isFullScreen) {
		document.querySelector("html").setAttribute("fullscreen", "");
	}
}

function render(value, width, invertColorFlag) {
	displayAvatar("displayDiv", {
		text: value,
		width: width,
		invertColor: invertColorFlag,
	});
	colorInput.value =
		document.getElementById("displayDiv").style.backgroundColor;
}

textInput.addEventListener("input", (e) => {
	var value = e.currentTarget.value;
	render(value, widthInput.value, invertColorChkbx.checked);
});

widthInput.addEventListener("input", (e) => {
	var value = e.currentTarget.value;
	var valid = CSS.supports("width", value);
	if (valid) {
		widthInput.classList.remove("is-invalid");
	} else {
		widthInput.classList.add("is-invalid");
	}
	var width = value ? value : DEFAULT_AVATAR_DIV_WIDTH;
	render(textInput.value, width, invertColorChkbx.checked);
});

invertColorChkbx.addEventListener("change", function () {
	var checked = this.checked;
	render(textInput.value, widthInput.value, checked);
});

textInput.dispatchEvent(new Event("input"));
