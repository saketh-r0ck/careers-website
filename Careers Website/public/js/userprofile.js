
let x = document.getElementsByClassName('status')
console.log(x)
for(let i=0;i<x.length;i++) {
    console.log(x[i].innerText)

    if(x[i].innerText == "Rejected"){
        x[i].style.color = "red";
    }else if(x[i].innerText == "Accepted"){
        x[i].style.color = "#38E54D";
    }else{
        x[i].style.color = "#FFBA00";
    }
}