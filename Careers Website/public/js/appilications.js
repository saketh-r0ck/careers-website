/* contact details on hover  */

let y = document.getElementsByClassName('contact');
let z = document.getElementsByClassName('application');
for(let i=0;i<z.length;i++){
    z[i].addEventListener("mouseover",function (e){
        y[i].style.display = "flex";
    })
    z[i].addEventListener("mouseout",function (e){
        y[i].style.display = "none";
    })
} 



