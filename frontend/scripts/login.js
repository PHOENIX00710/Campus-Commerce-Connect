document.addEventListener('DOMContentLoaded', async () => {
    const passwordInput = document.getElementById("login-password");
    const passwordToggle = document.getElementById("password-toggle");

    passwordToggle.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggle.classList.remove("fa-eye");
            passwordToggle.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            passwordToggle.classList.remove("fa-eye-slash");
            passwordToggle.classList.add("fa-eye");
        }
    });

    const mess = document.querySelector('#message');

})