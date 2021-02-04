"use strict";
const fs = require("fs");

//Trouve doublons id qui n'ont pas le même messages
//L'endroit ou on cherche les doublons
const pwd = "/home/seb/Documents/i18n/extracted/src";
// Tableaux  ou j'ai tout mes messages
let tabMesMessages = [];

//fonction qui met tout les éléments dans le tableaux

function Lecture(cheminDoss) {
  // console.log(chemin);
  if (fs.lstatSync(cheminDoss).isDirectory()) {
    const ListFIch = fs.readdirSync(cheminDoss);
    for (const monFichier of ListFIch) {
      // console.log(ListFIch);
      let chemin = cheminDoss + "/" + monFichier;
      if (fs.lstatSync(chemin).isFile()) {
        // console.log(chemin);
        let data = JSON.parse(fs.readFileSync(chemin));

        tabMesMessages = [...tabMesMessages, ...data];
      } else {
        Lecture(chemin);
      }
    }
  } else {
    let data = JSON.parse(fs.readFileSync(chemin));
    tabMesMessages = [...tabMesMessages, ...data];
  }
}

//Recherche des fichiers et dossiers dans pwd
const ListFIch = fs.readdirSync(pwd);
for (const monFichier of ListFIch) {
  console.log(monFichier);
  Lecture(pwd + "/" + monFichier);
}

//Trouve doublons id qui n'ont pas le même messages
const dict = new Map();
for (const monMess of tabMesMessages) {
  //Si dans le tableau
  if (dict.has(monMess.id)) {
    //Si la valeur  correspondant à la clé ne correspond pas doublons qui plante
    console.log(dict.get(monMess.id).defaultMessage);
    if (monMess.defaultMessage != dict.get(monMess.id).defaultMessage) {
      let mess =
        "doublons id :\n" +
        "Mess :" +
        monMess.defaultMessage +
        " id :" +
        monMess.id +
        " src :" +
        monMess.file +
        " ligne : " +
        monMess.start.line +
        "\n" +
        "Mess(2) : " +
        dict.get(monMess.id).defaultMessage +
        " id : " +
        monMess.id +
        " src : " +
        dict.get(monMess.id).file +
        " ligne : " +
        dict.get(monMess.id).start.line +
        "";
      console.log(mess);
      fs.writeFileSync("FichierQuiFaitPlante.txt", mess);
    }
  } else {
    dict.set(monMess.id, monMess);
  }
}
