// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})

// Smooth auto-dismiss flash messages
setTimeout(() => {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    alert.classList.remove('show');  // triggers fade-out
    setTimeout(() => {
      alert.remove();  // fully remove after fade transition
    }, 500); // wait for fade transition (default Bootstrap: 0.15s, we keep 0.5s for smoother effect)
  });
}, 3000);

