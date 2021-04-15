const nameLogo = document.getElementById("nameLogo")


if(innerWidth < 1440 || innerHeight <900){
    hero.style.top= "10%"
    hero.style.left= "5%"
    nameLogo.style.display = "none"
}
else{
    nameLogo.style.display = ""
}
addEventListener("resize", ()=>{
    if(innerWidth < 1440 || innerHeight <900){
        hero.style.top= "10%"
        hero.style.left= "5%"
        nameLogo.style.display = "none"
    }
    else{
        hero.style.top= "22%"
        hero.style.left= "16%"
        nameLogo.style.display = ""
    }
})