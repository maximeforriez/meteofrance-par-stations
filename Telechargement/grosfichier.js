const console = require("console");
const fs = require("fs");
//const prompt = require("prompt-sync");
const readline = require("node:readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("1 : Créer les fichiers à partir du fichier Gros-fichiers.csv\n2 : Vider le fichier Gros-fichiers.csv\nChoix ? ", choix => {
	switch(choix)
	{
		case "1":
			main();
			break;
		case "2":
			viderListeGrosFichiers();
			break;
		default:
			arretDuScript(true);
			break;
	}
});

function arretDuScript(test)
{
	if(test == true)
	{
		console.info("Commande inconnue");
	}
	process.exit();
}

let grosFichierData = [];
function setGrosFichierData(data)
{
	/*Avant de le lancer, vérifier que ça marche !*/
	grosFichierData = union(data.sort());
}
function getGrosFichierData()
{
	return grosFichierData;
}

let titreLigne = [];
function setTitreLigne(data)
{
	titreLigne = data;
}
function getTitreLigne()
{
	return titreLigne;
}

function union(tableau)
{
	let union = [];
	for(let i = 0 ; i < tableau.length ; i++)
	{
		if(tableau[i] != "")
		{
			if(tableau[i + 1] != tableau[i])
			{
				union.push(tableau[i]);
			}
		}
	}
	return union;
}

async function mettreEnOrdre(data, titre, adresse, iteration)
{
	await enregistrementDefinitif(adresse, titre.join(',') + data.split("\n").sort().join("\n").slice(3,-1).split("\n").sort().join("\n"), iteration);
}

async function enregistrementDefinitif(adresse, texte, iteration)
{
	await fs.writeFileSync(adresse, texte, {encoding: "utf8", flag: "w", mode: 0o666});
	console.info(adresse + " -> corrigé (" + iteration + "/" + getGrosFichierData().length + ")");
}

async function viderListeGrosFichiers()
{
	await fs.writeFileSync("./Gros-fichiers.csv", "", {encoding: "utf8", flag: "w", mode: 0o666});
	console.info("./Gros-fichiers.csv" + " -> vidange");
	arretDuScript(false);
}

async function main()
{
 	await fs.readFile("./Gros-fichiers.csv", 'utf8', (error, data) => {
		if(!error)
		{
			setGrosFichierData(data.split("\n"));
			let fichier = getGrosFichierData();
			if(fichier[fichier.length] == "")
			{
				fichier.pop();
			}
			setGrosFichierData(fichier);
			fs.readFile("./Titre-Ligne.csv", 'utf8', (error, data) => {
				if(!error)
				{
					setTitreLigne(data.split(","));
					traitementData();
					// arretDuScript(false);
				}
				else
				{
					console.error("Erreur sur Titre-Ligne.csv : ", error);
					arretDuScript(false);
				}
			});
		}
		else
		{
			console.error("Erreur sur Gros-fichier.csv : ", error);
			arretDuScript(false);
		}
 	});
}

async function traitementData()
{
	for(let i = 0 ; i < getGrosFichierData().length ; i++)
	{
		await fs.readFile(getGrosFichierData()[i], 'utf8', (error, data) => {
			if(!error)
			{
				mettreEnOrdre('"' + data + '"', getTitreLigne(), getGrosFichierData()[i], i + 1);
			}
			else
			{
				console.error("Erreur dans la lecture des données : ", error);
				arretDuScript(false);
			}
		});
	}
}
