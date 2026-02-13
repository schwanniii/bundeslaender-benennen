const alleBundesländer = Array("Schleswig-Holstein","Mecklenburg-Vorpommern","Hamburg","Niedersachsen","Bremen","Thüringen","Sachsen","Sachsen-Anhalt","Brandenburg",
"Berlin","Nordrhein-Westfalen","Hessen","Rheinland-Pfalz","Saarland","Baden-Württemberg","Bayern");

let zufälligesBundesland;
var hilfenAngezeigt = false;
var lösungAngezeigt = false;

function neueRunde() { //neues bundesland anzeigen
    if(lösungAngezeigt === true){ //vorherige lösung löschen
        buttonColorÄndernEinzeln("rgba(214, 74, 55, 0.4)");
    }

    zufälligesBundesland = alleBundesländer[Math.floor(Math.random()*alleBundesländer.length)];
    
    document.getElementById("frage").innerText = zufälligesBundesland;

    if(lösungAngezeigt === true){ //bei hilfe an: hintergrund der buttons rot
        buttonColorÄndernEinzeln("red");
    }
}

function AnswerGiven(Answer) {
    if(Answer === zufälligesBundesland) { //wenn richtig: neue runde und grüner hintergrund
        console.log("richtig");
        changeBackground("rgb(130, 201, 130)"); //grün
        setTimeout(() => {
            changeBackground("var(--main_color_bg)"); //normalfarbe hintergrund
          }, 500);

        neueRunde();
    } else{ //wenn falsch: roter hintergrund
        console.log("falsch");
        changeBackground("rgb(224, 114, 114)"); //rot
        setTimeout(() => {
            changeBackground("var(--main_color_bg)"); //normalfarbe hintergrund
          }, 500);
    }
}

function changeBackground(color){
    document.body.style.background = color;
}

function buttonColorÄndernEinzeln(color){
    document.getElementById(zufälligesBundesland).style.background = color;
}

const bundesländerHilfen = [];

document.getElementById("btn_hilfeUmschalten").addEventListener("click", function(e){ //hilfe anzeigen
    if(hilfenAngezeigt === true){
        for(let i = 0; i < alleBundesländer.length; i++){ //alle namen löschen
            document.getElementById(alleBundesländer[i]).innerText = "";
        }
        hilfenAngezeigt = false;
    } else{
        for(let i = 0; i < alleBundesländer.length; i++){ //alle namen anzeigen
            document.getElementById(alleBundesländer[i]).innerText = bundesländerHilfen[i];
        }
        hilfenAngezeigt = true;
    }
});

document.getElementById("btn_lösungAnzeigenUmschalten").addEventListener("click", function(e){ //lösung anzeigen
    if(lösungAngezeigt === true){
        for(let i = 0; i < alleBundesländer.length; i++){ //jede farbe resetten
            document.getElementById(alleBundesländer[i]).style.background = "rgba(214, 74, 55, 0.4)"; //normalfarbe button
        }
        lösungAngezeigt = false;
    } else{
        buttonColorÄndernEinzeln("red"); //farbe für erstes bundesland anzeigen
        lösungAngezeigt = true;
    }
});

neueRunde();

for(let i = 0; i < alleBundesländer.length; i++){ //alle namen der bundesländer in einer array speichern
    bundesländerHilfen.push(document.getElementById(alleBundesländer[i]).innerText);
}

for(let i = 0; i < alleBundesländer.length; i++){ //am anfang alle löschen
    document.getElementById(alleBundesländer[i]).innerText = "";
}