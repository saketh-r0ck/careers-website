/*  hidding job details */  
let togglebtn = document.getElementsByClassName('down_btn');
let hiddendiv = document.getElementsByClassName('drop_down');
for(let i=0;i<togglebtn.length;i++){
    togglebtn[i].addEventListener('click',function (event){
        if( hiddendiv[i].style.display == "none"){
            hiddendiv[i].style.display = "block";
        }
        else{
            hiddendiv[i].style.display = "none";
        }
        
    })
}

