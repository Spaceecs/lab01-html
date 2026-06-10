// app.js
const btn = document.querySelector("button[type='submit']");
if (btn) {
  btn.addEventListener("click", (e) => {
    const form = btn.closest("form");
    if (form && form.checkValidity()) {
      const oldText = btn.textContent;
      btn.textContent = "ТИ НАТИСНУВ(ЛА) МЕНЕ!! ❤";

      setTimeout(() => {
        btn.textContent = oldText;
      }, 1000);
    }
  });
}
