const customForm = document.getElementById('custom-form');
const formMessage = document.getElementById('form-message');

async function processForm(e) {
	if (e.preventDefault) e.preventDefault();
	
	const response = await fetch(window.location.pathname, {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
	});

	if (response.redirected) {
		window.location.href = response.url;
		return
	}

	const result = await response.json();
	if (!result.ok) {
		formMessage.classList.remove("hide");
		formMessage.textContent = result.message;
		return
	}

    return false;
}


formMessage.classList.add("hide") // hide formMessage by default
if (customForm.attachEvent) {
    customForm.attachEvent("submit", processForm);
} else {
    customForm.addEventListener("submit", processForm);
}