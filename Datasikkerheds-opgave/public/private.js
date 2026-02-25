const messageDiv = document.getElementById("message");
const modal = document.getElementById("modal");

// modal der viser besked hvis session er udløbet
function showModal(message) {
  messageDiv.textContent = message;
  modal.classList.remove("hidden");
}

// kald til backend
async function fetchApi() {
  const url = "/api/userdata";
  try {
    // session cookie sendes med requesten
    const response = await fetch(url);
    console.log("Status:", response.status);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    // hobby og navn vises på private siden
    const result = await response.json();
    const name = document.getElementById("name");
    const hobby = document.getElementById("hobby");
    name.textContent = `Hej ${result.username}`;
    hobby.textContent = `Din hobby er ${result.hobby}`;
  } catch (error) {
    console.log(error.message);
    setTimeout(() => window.location.assign("/"), 2000);
  }
}

// tjekker api/userdata hver 5 sekund
// hvis 401 vises modal og der redirectes
function startSessionCheck() {
  setInterval(async () => {
    try {
      const response = await fetch("/api/userdata");
      if (response.status === 401) {
        showModal("Sessionen er udløbet, du bliver sendt tilbage til login");
        setTimeout(() => window.location.assign("/"), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);
}

fetchApi();
startSessionCheck();
