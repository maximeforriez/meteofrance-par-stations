/*Téléchargement des données avec Mathematica*/

/*modules*/
const console = require("console");
const fs = require("fs");
const { departement } = require("./departement");/*departement.js contient les territoires couverts.*/
const { periode } = require("./periode");/*periode.js contient les périodes couvertes.*/
// const { convertArrayToCSV } = require('convert-array-to-csv');
const readline = require("readline");

/*Dossier de référence*/
const dossier = "meteofrance";

console.info("Téléchargement des ressources de Météo France");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Choisir tous les départements : Tapez 0\nChoisir un numéro de département (1 à 95 ; 99 ; 971 à 975 ; 984 à 988)\nChoix ? ", choix => {
	if(choix == "0")
	{
		main(0);
	}
	else if(parseInt(choix) > 0 && parseInt(choix) < 96)
	{
		main(parseInt(choix));
	}
	else if(parseInt(choix) == 99)
	{
		main(parseInt(choix - 3));
	}
	else if(parseInt(choix) > 970 && parseInt(choix) < 976)
	{
		main(parseInt(choix - 874));
	}
	else if(parseInt(choix) > 983 && parseInt(choix) < 989)
	{
		main(parseInt(choix - 882));
	}
	else
	{
		arretDuScript(true);
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

/*NodeJS a un buffer limité à 512Mo. Certains fichiers trop gros doivent être traités avec Mathematica.*/
function main(num)
{
	// console.info(getUrl());
	if(num == 0)
	{
		console.info("Tous les départements ont été choisis.");
		for(let i = 0 ; i < departement.length ; i++)
		{
			for(let element of getPaquet()[i])
			{
				lireDonnees(element[0], element[1], element[2]);
			}
		}
	}
	else
	{
		let numDepartement = num - 1;
		console.info("Le département " + departement[[numDepartement]] + " a été choisi.");
		for(let element of getPaquet()[numDepartement])
		{
			lireDonnees(element[0], element[1], element[2]);
		}
	}
	// arretDuScript(false);
}

/*URL*/
function getUrl()
{
	let url = [];
	for(let i = 0 ; i < departement.length ; i++)
	{
		for(let j = 0 ; j < periode.length ; j++)
		{
			// url.push([departement[i], periode[j], "https://object.files.data.gouv.fr/meteofrance/data/synchro_ftp/BASE/HOR/H_" + departement[i] + "_" + periode[j] + ".csv.gz"]);
			url.push([departement[i], periode[j], "./" + dossier + "/" + departement[i] + "/" + periode[j] + ".csv"]);
		}
	}
	return url;
}

/*Il faut créer des paquets afin de ne pas surcharger la mémoire.*/
function getPaquet()
{
	let paquet = [];
	for(let element of departement)
	{
		paquet.push(position(element, getUrl()));
	}
	return paquet;
}

/*
async function download(url)
{
	await fetch(url[2],
		{
			method: 'GET',
			mode: "no-cors",
			headers: {
				"Content-type": "text/csv"
			},
			credentials: "omit",
			referrerPolicy: "no-referrer-when-downgrade",
			// body: JSON.stringify({message: "Requête vers le site Météo France demandée"})
		}
	)
	.then((response) => {
		if(response.ok)
		{
			return response.text();
		}
		else
		{
			console.error(url + " - " + "Erreur ! Données de Météo France non transmises");
		}
	})
	.then((data) => {
		enregistrerDonnees(url[0], url[1], data);
	})
	.catch(error => console.error(url + " - " + "Erreur : " + error));
}
*/

/*Récupérer la ligne de titres pour les gros fichiers*/
let titreLigne = "";
function getTitre()
{
	return titreLigne;
}
function setTitre(titre)
{
	titreLigne = titre;
}

/*Récupérer la station en cours de traitement dans un gros fichier*/
let stationGrosFichier = "";
function getStationGrosFichier()
{
	return stationGrosFichier;
}
function setStationGrosFichier(station)
{
	stationGrosFichier = station;
}

/*Préparer l'enregistrement par ligne un gros fichier*/
function enregistrementParLigne(url, adresse, periode, test1, test2)
{
	let testTitre = test1;
	let testStation = test2;
	const rl = readline.createInterface({
		input: fs.createReadStream(url, {flag: "r", encoding: "utf-8", mode: 0o666, start: 0, end: Infinity}),
		crlfDelay: Infinity
	});
	rl.on("line", (line) => {
		const table = line.split(",");
		const cellule1 = table[0];
		const nomFichier = adresse + periode + "-" + cellule1 + ".csv";
		if(cellule1 == "NUM_POSTE")
		{
			setTitre(table);
			testTitre = true;
		}
		if(cellule1 != "NUM_POSTE" && testStation == true)
		{
			setStationGrosFichier(cellule1);
			testStation = false;
		}
		if(cellule1 != "NUM_POSTE")
		{
			setListeDesFichiers(nomFichier);
			if(cellule1 == getStationGrosFichier())
			{
				// if(testTitre == true)
				// {
					// enregistrementGrosFichierParLigne(nomFichier, getTitre());
					// testTitre = false;
				// }
				enregistrementGrosFichierParLigne(nomFichier, table);
			}
			else
			{
				testStation = true;
				// testTitre = true;
				// if(testTitre == true)
				// {
					// enregistrementGrosFichierParLigne(nomFichier, getTitre());
					// testTitre = false;
				// }
				enregistrementGrosFichierParLigne(nomFichier, table);
			}
		}
	});
	rl.on("close", () => {
		console.info("Le gros fichier " + url + " a été traité. Les stations sont enregistrées.");
	});
	return;
}

/*Enregistrer par ligne un gros fichier*/
function enregistrementGrosFichierParLigne(nomFichier, table)
{
	fs.appendFile(nomFichier, '"' + table.join('","') + '"\n', (err) => {});
}

/**/
let listeDesFichiers = [];
function getListeDesFichiers()
{
	return listeDesFichiers;
}
function setListeDesFichiers(element)
{
	if(getListeDesFichiers() == [])
	{
		fs.appendFile("./Gros-fichiers.csv", element + '\n', (err) => {});
		getListeDesFichiers().push(element);
	}
	if(getListeDesFichiers().slice(-1) != element)
	{
		fs.appendFile("./Gros-fichiers.csv", element + '\n', (err) => {});
		getListeDesFichiers().push(element);
	}
}

/*Lire et choisir le type de fichier (petit ou gros)*/
async function lireDonnees(departement, periode, url)
{
	if(!fs.existsSync(url))
	{
		console.error("Le fichier " + url + " n'existe pas.");
	}
	else
	{
		await fs.readFile(url, 'utf8', (error, data) => {
			if(error)
			{
				if(error.code == "ERR_STRING_TOO_LONG");
				{
					const adresse = "./" + dossier + "/" + departement + "/";
					const taille = Math.ceil(fs.statSync(url).size / (1024 * 1024));
					console.error("Le fichier " + url + " a une taille de " + taille + " Mo. Il est trop grand pour être lu. Le fichier doit avoir une taille inférieure à 512 Mo. Un traitement alternatif s'est déclenché.");
					enregistrementParLigne(url, adresse, periode, false, true);
				}
			}
			else
			{
				enregistrerDonnees(departement, periode, data);
			}
		});
	}
}

/*Enregistrer les données d'un petit fichier*/
function enregistrerDonnees(departement, periode, data)
{
	let data2 = data.split("\n");
	let data3 = [];
	for(let element of data2)
	{
		data3.push(element.split(","));/*À changer en fonction des fichiers téléchargés*/
	}
	const titre = data3[0];
	data3 = data3.slice(1, data3.length);
	let stations = [];
	for(let element of data3)
	{
		stations.push(element[0]);
	}
	const station = union(stations.sort());
	for(let element of station)
	{
		adresse = "./" + dossier + "/" + departement + "/" + periode + "-" + element + ".csv";
		if(!fs.existsSync(adresse))
		{
			const data4 = position(element, data3);
			let data5 = ['"' + titre.join('","') + '"'];
			for(let element of data4)
			{
				data5.push('"' + element.join('","') + '"');
			}
			data5 = data5.join("\n");
			fs.writeFileSync(adresse, data5, {encoding: "utf8", flag: "w", mode: 0o666});
			console.info("Station : " + element + " (" + departement + " - " + periode + ")");
			// const csvFromArrayOfArrays = convertArrayToCSV(data4, {
				// titre,
				// separator: ','
			// });
			// fs.writeFile(adresse, csvFromArrayOfArrays, error => {
				// if(error)
				// {
					// console.error(error);
				// }
				// console.info("Le fichier a été sauvegardé.")
			// });
		}
		else
		{
			console.info("Station : " + element + " (" + departement + " - " + periode + ") -> Fichier existant");
		}
	}
	console.info("Département : " + departement + " - Période : " + periode + " -> OK");
}

/*Créer une liste de stations en supprimant les doublons*/
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

/*Repérer les lignes correspondant à une station*/
function position(liste, tableau)
{
	let decoupe = [];
	for(i = 0 ; i < tableau.length ; i++)
	{
		if(tableau[i][0] == liste)
		{
			decoupe.push(tableau[i]);
		}
	}
	return decoupe;
}
