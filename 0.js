const greetingForm = document.querySelector("#greetingForm");
const nameInput = document.querySelector("#name");
const greetingSelect = document.querySelector("#greeting");
const greetingMessage = document.querySelector("#greetingMessage");

function buildGreeting(greeting, name) {
  if (greeting === "What's up?") {
    return `What's up, ${name}?`;
  }

  return `${greeting}, ${name}!`;
}

function showMessage(message, isError = false) {
  greetingMessage.textContent = message;
  greetingMessage.classList.toggle("is-error", isError);
}

greetingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const greeting = greetingSelect.value;

  if (name === "") {
    showMessage("Please enter your full name first.", true);
    nameInput.focus();
    return;
  }

  showMessage(buildGreeting(greeting, name));
  greetingForm.reset();
  nameInput.focus();
});
