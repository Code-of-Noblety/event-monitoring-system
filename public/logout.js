function logout() {
	fetch('/logout', {method: "POST"}).then(response => {
		if (response.redirected) {
			window.location.href = response.url;
		}
	})
} 