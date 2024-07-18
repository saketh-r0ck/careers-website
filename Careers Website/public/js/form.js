

const resumefile = document.getElementById('file');
console.log(resumefile.files[0])
const file_error = document.getElementById('file_error');
if (resumefile.files[0].type !== 'application/pdf') {
    file_error.innerHTML = "Invalid file";
    return ;
}
