var x = document.getElementById("jobform");
x.addEventListener('submit',logged);

function logged(){
    alert("You have succesfully logged in.");
}


// validate user login form
function validateForm() {
    const form = document.querySelector('#login-form');
    const emailInput = document.querySelector('#email');
  
    const passwordInput = document.querySelector('#password');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!/\S+@\S+\.\S+/.test(email)) {
      document.getElementById("error-message").innerHTML='Email is invalid. '
       return false
    }
    else {

      document.getElementById("login-form").method="post"
      document.getElementById("login-form").action="/login"
    }
  }

