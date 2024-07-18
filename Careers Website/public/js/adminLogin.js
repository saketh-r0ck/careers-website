const adminBtn = document.getElementById('adminbtn');
    const superAdminBtn = document.getElementById('superAdminbtn');

    adminBtn.addEventListener('click', function() {
        adminBtn.classList.add('selected');
        superAdminBtn.classList.remove('selected');
        document.getElementById('admintype').value = "admin"
    });

    superAdminBtn.addEventListener('click', function() {
        superAdminBtn.classList.add('selected');
        adminBtn.classList.remove('selected');
        document.getElementById('admintype').value = 'superadmin'
    });

//   validate adminlogin form
function validateform() {
    const form = document.querySelector('#admin-form');
    const userNameInput = document.querySelector('#adminusername');
  
    const passwordInput = document.querySelector('#adminpassword');
    const userName = userNameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!/^[a-zA-Z\s]+$/i.test(userName)) {
      document.getElementById("error-message").innerHTML='user name must contain only letters.'
       return false
    } else if (userName.length < 2 || userName.length > 20) {
      document.getElementById("error-message").innerHTML= 'User Name must be between 2 and 20 characters long.'; return false
    }
   
    else {
    document.getElementById("admin-form").method="post"
    document.getElementById("admin-form").action="/admin"
    }
  }