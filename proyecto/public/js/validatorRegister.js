

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("#register-form");

    form.addEventListener("submit", function(event) {
        const nameInput = form.querySelector("input[name='nombre']");
        const emailInput = form.querySelector("input[name='correo']");
        const passwordInput = form.querySelector("input[name='password']");
        const conpasswordInput = form.querySelector("input[name='conpassword']");
        let hasErrors = false;

        // Limpiar la lista de errores
        const errorListDiv = form.querySelector('.error-list');
        errorListDiv.innerHTML = ''; // limpia cualquier error anterior

        const errorList = document.createElement('ul');

        // Validar nombre
        if (validator.isEmpty(nameInput.value)) {
            const li = document.createElement('li');
            li.textContent = "El nombre es obligatorio.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar email
        if (!validator.isEmail(emailInput.value)) {
            const li = document.createElement('li');
            li.textContent = "Correo no válido.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar contraseña
        if (!validator.isLength(passwordInput.value, { min: 8 })) {
            const li = document.createElement('li');
            li.textContent = "La contraseña debe tener al menos 8 caracteres.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar que las contraseñas coincidan
        if (passwordInput.value !== conpasswordInput.value) {
            const li = document.createElement('li');
            li.textContent = "Las contraseñas no coinciden.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Si hay errores, añade la lista de errores al error-list div
        if (hasErrors) {
            errorListDiv.appendChild(errorList);
            event.preventDefault();
        }
    });
});


