

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("#login-form");

    form.addEventListener("submit", function(event) {
        const emailInput = form.querySelector("input[name='correo']");
        const passwordInput = form.querySelector("input[name='password']");
        let hasErrors = false;

        // Limpiar la lista de errores
        const errorListDiv = form.querySelector('.error-list');
        errorListDiv.innerHTML = ''; // limpia cualquier error anterior

        const errorList = document.createElement('ul');
        console.log("prueba")
        // Validar email
        if (!validator.isEmail(emailInput.value)) {
            console.log('Angie Apesta!!!')
            const li = document.createElement('li');
            li.textContent = "Correo no válido.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar longitud  contraseña
        if (!validator.isLength(passwordInput.value, { min: 8 })) {
            const li = document.createElement('li');
            li.textContent = "La contraseña debe tener al menos 8 caracteres.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar correo no vacio
        if (validator.isEmpty(emailInput.value)) {
            const li = document.createElement('li');
            li.textContent = "El correo es obligatorio.";
            errorList.appendChild(li);
            hasErrors = true;
        }
        // Validar contraseña no vacia
        if (validator.isEmpty(passwordInput.value)) {
            const li = document.createElement('li');
            li.textContent = "La contraseña es obligatoria";
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


