const messageDiv = document.getElementById("message");
async function fetchApi() {
  const url = "/api/userdata";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    const name = document.getElementById("name");
    const hobby = document.getElementById("hobby");
    name.textContent = `Hej ${result.username}`;
    hobby.textContent = `Din hobby er ${result.hobby}`;
  } catch (error) {
    console.log(error.message);
    messageDiv.textContent = "Der skete en fejl. Prøv igen senere.";
    setTimeout(() => window.location.assign("/"), 2000);
  }
}

function startSessionCheck() {
  setInterval(async () => {
    try {
      const response = await fetch("/api/userdata");
      if (response.status === 401) {
        messageDiv.textContent =
          "Sessionen er udløbet, du bliver sendt tilbage til login";
        setTimeout(() => window.location.assign("/"), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);
}

fetchApi();
startSessionCheck();
