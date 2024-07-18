document.querySelector('form').onsubmit = e => {
    e.target.submit();
    alert('Job has successfully added!');
    e.target.reset();
    
};