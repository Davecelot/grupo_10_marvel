

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#product-form");
    form.addEventListener("submit", function(event) {

        const nameInput = form.querySelector("input[name='nombre']");
        const durationInput = form.querySelector("input[name='duracion']");
        const yearInput = form.querySelector("input[name='year']");
        const ratingSelect = form.querySelector("select[name='clasificacionEdad']");
        const descriptionInput = form.querySelector("input[name='descripcion']");
        const warningInput = form.querySelector("input[name='advertenciaContenido']");
        const directorField = form.querySelector('input[name="director"]');
        const repartoField = form.querySelector('input[name="reparto"]');
        const estudioField = form.querySelector('input[name="estudio"]');
        const precioField = form.querySelector('input[name="precio"]');
        const imagenInput = form.querySelector('input[name="imagen"]');
        const generoSelect = form.querySelector('select[name="genero"]');
        const precioValue = parseFloat(precioField.value); // Convertir el valor a float
        
        let hasErrors = false;

        // Limpiar la lista de errores
        const errorListDiv = form.querySelector('.error-list');
        errorListDiv.innerHTML = ''; // limpia cualquier error anterior

        const errorList = document.createElement('ul');
        // Validar nombre
        if (validator.isEmpty(nameInput.value)) {
            const li = document.createElement('li');
            li.textContent = "El nombre de la película es obligatorio.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar año
        if (!validator.isNumeric(yearInput.value.trim(), { min: 1900, max: new Date().getFullYear() })) {
            const li = document.createElement('li');
            li.textContent = "El año debe ser un número válido.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar descripción
        if (validator.isEmpty(descriptionInput.value.trim())) {
            const li = document.createElement('li');
            li.textContent = "La descripción de la película es obligatoria.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar advertencia
        if (validator.isEmpty(warningInput.value.trim())) {
            const li = document.createElement('li');
            li.textContent = "La advertencia de contenido es obligatoria.";
            errorList.appendChild(li);
            hasErrors = true;
        }


        if (validator.isEmpty(directorField.value.trim())) {
            const li = document.createElement('li');
            li.textContent = "El director de la película es obligatoria.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        const repartoArray = repartoField.value.split(',').map(name => name.trim());

        if (repartoArray.length > 3) {
            const li = document.createElement('li');
            li.textContent = "El reparto debe tener un máximo de 3 nombres.";
            errorList.appendChild(li);
            hasErrors = true;
        } else {
            for (let name of repartoArray) {
                if (!validator.isAlpha(name.replace(/\s+/g, ''), 'es-ES')) { // reemplazar espacios y verificar solo caracteres alfabéticos
                    const li = document.createElement('li');
                    li.textContent = `'${name}' no es un nombre válido. El reparto solo debe contener nombres alfabéticos separados por comas.`;
                    errorList.appendChild(li);
                    hasErrors = true;
                    break;
                }
            }
        }

        if (validator.isEmpty(estudioField.value.trim())) {
            const li = document.createElement('li');
            li.textContent = "El estudio de la película es obligatoria.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        if (validator.isEmpty(precioField.value.trim())) {
            const li = document.createElement('li');
            li.textContent = "El precio es obligatorio.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Validar que el precio sea un número positivo
        else if (isNaN(precioValue) || precioValue <= 0) {
            const li = document.createElement('li');
            li.textContent = "El precio debe ser un número positivo.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        if (!imagenInput.files || imagenInput.files.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Debe seleccionar una imagen.";
            errorList.appendChild(li);
            hasErrors = true;
        } else {
            const file = imagenInput.files[0];
            const fileTypes = ['image/jpeg', 'image/png']; // Puedes agregar más tipos de archivos si lo deseas

            // Verificar el tipo de archivo
            if (!fileTypes.includes(file.type)) {
                const li = document.createElement('li');
                li.textContent = "El tipo de archivo no es válido. Aceptamos .jpeg y .png.";
                errorList.appendChild(li);
                hasErrors = true;
            }

            // Verificar el tamaño del archivo (por ejemplo, menos de 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                const li = document.createElement('li');
                li.textContent = "El tamaño de la imagen no debe exceder de 5MB.";
                errorList.appendChild(li);
                hasErrors = true;
            }
        }

        if (validator.isEmpty(generoSelect.value)) {
            const li = document.createElement('li');
            li.textContent = "Debe seleccionar un género.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Verificar si el campo de duración está vacío
        if (validator.isEmpty(durationInput.value.trim())) {
            const li = document.createElement('li');
            li.textContent = "La duración es obligatoria.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Verificar si el campo de duración es numérico
        else if (!validator.isNumeric(durationInput.value)) {
            const li = document.createElement('li');
            li.textContent = "La duración debe ser un valor numérico.";
            errorList.appendChild(li);
            hasErrors = true;
        }

        // Verificar si no se ha seleccionado una clasificación de edad
        if (validator.isEmpty(ratingSelect.value)) {
            const li = document.createElement('li');
            li.textContent = "Debes seleccionar una clasificación de edad.";
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


