(function () {
  const pw = document.querySelector('input[name="password"]');
  const cb = document.getElementById("showPassword");
  if (cb && pw) {
    cb.addEventListener("change", function () {
      pw.type = this.checked ? "text" : "password";
    });
  }
})();
