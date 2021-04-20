const nameLogo = document.getElementById("nameLogo")

if(innerWidth < 1440 || innerHeight <900){
    nameLogo.style.display = "none"
}
else{
    nameLogo.style.display = ""
}
addEventListener("resize", ()=>{
    if(innerWidth < 1440 || innerHeight <900){
        nameLogo.style.display = "none"
    }
    else{
        nameLogo.style.display = ""
    }
})
