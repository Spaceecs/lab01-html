const DRAFT_KEY = "contactDraft";

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const msgInput = document.getElementById("message");
  const agreeCheck = document.querySelector('input[name="agree"]');
  const charCounter = document.getElementById("char-counter");
  const successBlock = document.getElementById("form-success-block");
  const outputData = document.getElementById("submitted-data-output");

  const maxChars = 200;

  function loadDraft() {
    const savedData = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    if (savedData.name) nameInput.value = savedData.name;
    if (savedData.email) emailInput.value = savedData.email;
    if (savedData.phone) phoneInput.value = savedData.phone;
    if (savedData.message) {
      msgInput.value = savedData.message;
      updateCharCounter(savedData.message.length);
    }
    if (savedData.topic)
      document.getElementById("topic").value = savedData.topic;
  }

  function saveDraft() {
    const currentData = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      message: msgInput.value,
      topic: document.getElementById("topic").value,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(currentData));
  }

  function updateCharCounter(length) {
    if (charCounter) {
      charCounter.textContent = `${length} / ${maxChars}`;
      if (length >= maxChars) {
        charCounter.style.color = "#b00020";
      } else {
        charCounter.style.color = "";
      }
    }
  }

  form.addEventListener("input", saveDraft);

  if (msgInput) {
    msgInput.addEventListener("input", (e) => {
      if (e.target.value.length > maxChars) {
        e.target.value = e.target.value.slice(0, maxChars);
      }
      updateCharCounter(e.target.value.length);
    });
  }

  function validateField(input, errorElement, condition, errorText) {
    if (condition) {
      errorElement.textContent = errorText;
      input.classList.add("invalid-field");
      return false;
    } else {
      errorElement.textContent = "";
      input.classList.remove("invalid-field");
      return true;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isNameValid = validateField(
      nameInput,
      document.getElementById("name-error"),
      nameInput.value.trim().length < 2,
      "Ім'я має містити не менше 2 символів",
    );

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = validateField(
      emailInput,
      document.getElementById("email-error"),
      !emailRegex.test(emailInput.value.trim()),
      "Введіть коректну адресу email",
    );

    const isMessageValid = validateField(
      msgInput,
      document.getElementById("message-error"),
      msgInput.value.trim().length === 0,
      "Повідомлення не може бути порожнім",
    );

    const isAgreeValid = validateField(
      agreeCheck,
      document.getElementById("agree-error"),
      !agreeCheck.checked,
      "Необхідно надати згоду для продовження",
    );

    if (isNameValid && isEmailValid && isMessageValid && isAgreeValid) {
      const formData = new FormData(form);
      const formObj = Object.fromEntries(formData.entries());

      if (successBlock && outputData) {
        outputData.innerHTML = `
                    <p><strong>Ім'я:</strong> ${escapeHtml(formObj.name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(formObj.email)}</p>
                    <p><strong>Телефон:</strong> ${escapeHtml(formObj.phone || "Не вказано")}</p>
                    <p><strong>Тема:</strong> ${escapeHtml(formObj.topic)}</p>
                    <p><strong>Повідомлення:</strong> ${escapeHtml(formObj.message)}</p>
                `;
        successBlock.removeAttribute("hidden");
        form.reset();
        updateCharCounter(0);
        localStorage.removeItem(DRAFT_KEY);
        window.scrollTo({
          top: successBlock.offsetTop - 20,
          behavior: "smooth",
        });
      }
    }
  });

  form.addEventListener("reset", () => {
    document
      .querySelectorAll(".error-text")
      .forEach((el) => (el.textContent = ""));
    document
      .querySelectorAll("input, textarea")
      .forEach((el) => el.classList.remove("invalid-field"));
    localStorage.removeItem(DRAFT_KEY);
    updateCharCounter(0);
    if (successBlock) successBlock.setAttribute("hidden", "");
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  loadDraft();
}
