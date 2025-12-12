/*Fonction créant tous les dossiers et les sous-dossiers*/
function creerDossier(element)
{	
	if(fs.existsSync("./" + dossier + element + "\\"))
	{
		console.info("Dossier " + "./" + dossier + element + " existant");
	}
	else
	{
		fs.mkdir('./' + dossier + element + "\\", (erreur) => {
			if(erreur)
			{
				console.error("Erreur dans la création du dossier " + './' + dossier + element + "\\" + " : " + erreur);
			}
			else
			{
				console.info("Dossier " + './' + dossier + element + "\\" + " créé avec succès");
			}
		});
	}
}

/*Modules*/
const console = require("console");
const fs = require("fs");
const {departement} = require("./departement");
// const {periode} = require("./periode");

/*Liste des dossiers à créer*/
liste = departement;

/*Création du dossier principal*/
const dossier = "meteofrance\\";
if(fs.existsSync("./" + dossier))
{
	console.info("Dossier " + "./" + dossier + " existant");
}
else
{
	fs.mkdir('./' + dossier, (erreur) => {
		if(erreur)
		{
			console.error("Erreur dans la création du dossier " + './' + dossier + " : " + erreur);
		}
		else
		{
			console.info("Dossier " + './' + dossier + " créé avec succès");
		}
	});
}

for(element of liste)
{
	creerDossier(element);
}
