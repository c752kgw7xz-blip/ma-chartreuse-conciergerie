document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  if (!form) return;

  const showMessage = (type, text) => {
    let msg = form.querySelector(".form-message");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "form-message";
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.cssText = `
      padding: 12px 16px;
      border-radius: 10px;
      font-size: .9rem;
      margin-top: 8px;
      background: ${type === "success" ? "#e8f0eb" : "#fdecea"};
      color: ${type === "success" ? "#2f5a44" : "#c0392b"};
    `;
  };

  const submitBtn = form.querySelector("button[type='button']");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", () => {
    const name = form.querySelector("input[type='text']")?.value.trim();
    const email = form.querySelector("input[type='email']")?.value.trim();
    const message = form.querySelector("textarea")?.value.trim();

    if (!name) { showMessage("error", "Veuillez indiquer votre nom."); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("error", "Veuillez entrer une adresse email valide."); return;
    }
    if (!message) { showMessage("error", "Veuillez écrire un message."); return; }

    // ⚠️ À remplacer par votre service d'envoi (Formspree, Netlify Forms, etc.)
    // Exemple Formspree : fetch("https://formspree.io/f/VOTRE_ID", { method:"POST", body: new FormData(form) })
    showMessage("success", "Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 24–48h.");
    form.reset();
  });
});
