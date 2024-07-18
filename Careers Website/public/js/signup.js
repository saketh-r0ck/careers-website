
function validateForm() {
  const form = document.querySelector('#signupform');
  const firstNameInput = document.querySelector('#firstname');
  const lastNameInput = document.querySelector('#lastname');
  //const userNameInput = document.querySelector('#username');
  const phoneNoInput = document.querySelector('#phoneno');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const confirmpasswordInput = document.querySelector('#confirmpassword');
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  //const userName = userNameInput.value.trim();
  const phoneno = phoneNoInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmpassword = confirmpasswordInput.value.trim();
  const error_message = document.getElementById("error-message");
  if (!/^[a-zA-Z]+$/i.test(firstName)) {
    console.log("came in firstname.");

    error_message.innerHTML= 'First name must contain only letters.';     window.scrollTo(0,0);
    return false
  } else if (firstName.length < 2 || firstName.length > 20) {
    console.log("came in fname length.");

    error_message.innerHTML= 'First name must be between 2 and 20 characters long.';     window.scrollTo(0,0);
     return false
  } 

  // Validate last name
    else if (!/^[a-zA-Z\s]+$/i.test(lastName)) {
      console.log("came in lastnem.");

    error_message.innerHTML= 'Last name must contain only letters';     window.scrollTo(0,0);
    return false
  } else if (lastName.length < 2 || lastName.length > 20) {
    console.log("came in lname length.");

    error_message.innerHTML='Last name must be between 2 and 20 characters long.';     window.scrollTo(0,0);
    return false
  //} 
  // else if (!/^[a-zA-Z0-9_\s]+$/i.test(userName)) {
  //   console.log("came in submitted.");

  //   error_message.innerHTML='User name should contain only alpha-numeric and underscore .'; 
  //   window.scrollTo(0,0);
  //    return false
  // } else if (userName.length < 2 || userName.length > 20) {
  //   error_message.innerHTML= 'User Name must be between 2 and 20 characters long.'; 
  //   window.scrollTo(0,0);
  //   return false
  // }
  } else if (phoneno.length != 10) {
    console.log("came in phoneno.");

    error_message.innerHTML= 'Phone number should be 10 characters long.'; 
    window.scrollTo(0,0);
    return false
  }
  // Validate email
 
   else if (!/\S+@\S+\.\S+/.test(email)) {
    console.log("came in email.");

    error_message.innerHTML= 'Email is invalid.';
    window.scrollTo(0,0);
    return false
  } 
  // Validate password
 else if (password.length < 6 || password.length > 20) {
  console.log("came in password.");

    error_message.innerHTML= 'Password must be between 6 and 20 characters long.';     window.scrollTo(0,0);
    return false
  } 
  else if(confirmpassword!==password){
    console.log("came in cpassword.");

    error_message.innerHTML= 'Password is not matched';     window.scrollTo(0,0);
    return false
  }
  
 
  else {
    console.log("came in submitted.");
    document.getElementById("signupform").method="post";
    document.getElementById("signupform").action="/signup";
  }
}