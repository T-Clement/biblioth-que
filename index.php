
<!DOCTYPE HTML>
<html lang="fr">
<head>
	<title>Exercice PHP - BDD - AJAX</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/png" href="assets/logo.png"/>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link href="assets/style.css" rel="stylesheet">
	<link rel="stylesheet" href="assets/custom.css">
</head>
<body>
	<div class="bg-img1 size1 flex-w flex-c-m p-t-20 p-b-55 p-l-15 p-r-15">
		<div class="wsize1 bor1 bg1 p-b-45 p-l-15 p-r-15 p-t-20 respon1">
			<div class="wrappic1">
				<img src="assets/logo-creative.svg" alt="Logo Créative" width="75">
			</div>
			<p class="txt-center m1-txt1 p-t-33 p-b-68">
				Exercice PHP - BDD - AJAX
			</p>
			
			<div class="alert alert-info text-justify">
				<p>
					Cet exercice ajoute un aspect supplémentaire : 
					le dialogue avec une base de données.
				</p>
				<p>
					Cette page web "index.html" comprend 2 parties : « ajouter un nouveau livre » 
					et « vérifier l'existence d’un livre ».
				</p>
				<br>
				<p>
					Dans la partie 1, trois "input" de type "text" sont proposés (titre, nom de l'auteur et 
					référence) et un bouton d'envoi. Si l’utilisateur remplit correctement les trois champs, les données 
					sont envoyées par le biais d’une application AJAX. La page cible est la page "ajouter_livre.php" 
					qui effectue un nouveau contrôle des données. Si tous les tests sont concluants, les trois champs saisis
					sont insérés dans la base de données (voir le fichier "bdd.sql" fourni). 
					Un message de retour approprié doit ensuite s'afficher sur cette page Web, comme par exemple : 
				</p>
				<ul class="ml-4">
					<li><p>« le livre a été ajouté à la BDD »</p></li>
					<li><p>« les zones de texte n’ont pas été correctement remplies »</p></li>
					<li><p>etc…</p></li>
				</ul>
				<p>
					Dans la partie 2, un "input" de type "text" permet de rechercher si un 
					livre est inscrit dans la base de données. Pour cela, il faut saisir sa référence. 
					Si la zone de texte est remplie correctement, un appel AJAX cible le fichier
					"chercher_livre.php" qui effectue les tests et les traitements adaptés. 
					Si la référence est trouvée dans la base de données, les 3 champs correspondant à ce livre
					doivent être affichés dans un tableau dans la page "index.html".
					Si la référence n'est pas trouvé, un message de retour approprié sera affiché sur la même page.
				</p>
				<br>
				<p>
				<strong>Remarques :</strong>
				</p>
				<ul class="ml-4">
					<li>
						Le champ "référence" est composé des deux premières lettres du titre du livre, des deux premières 
						lettres du nom de l'auteur et de quatre chiffres définis aléatoirement. <br> 
						<em>Exemple pour le livre "Croc-Blanc" de Jack London : <strong>CRLO1234</strong></em>
					</li>
					<li>
						Le champ "référence" doit être unique à chaque livre. A vous de mettre en place les vérifications 
						nécéssaires, de la/des manière(s) que vous jugerez la/les plus adaptée(s).
					</li>
					<li>
						Utilisez la base de données <em>"bdd.sql"</em> qui vous est fournie.
					</li>
					<li>
						Stocker vos paramètres de connexion à votre base de données dans un fichier <em>'inc.connexion.php'</em> 
						que vous appelerez dans vos traitements PHP.
					</li>
					<li>
						Attention ! Pensez à effectuer de nombreux tests sur les valeurs saisies et transmises : au moins <em><strong>coté 
						PHP</strong></em> (et côté Javascript).
					</li>
				</ul>
			</div>
			<div id="toast"></div>
            <div class="card">
                <div class="card-header">
				<legend>Ajouter un nouveau livre</legend>
				<form id="add-book-form">
					<div>
						<label for="api-activation">Activer la recherche avec API</label>
						<input type="checkbox" name="api-activation" id="api-activation"/>
					</div>
					<div>
						<label for="title">Titre du livre</label>
						<input type="text" id="title" name="title" value=""/>
						<ul id="title-suggestions">
							<!-- data added here in JS -->
						</ul>
					</div>
					<div>
						<label for="author">Auteur du livre</label>
						<input type="text" id="author" name="author" value=""/>
					</div>
					<div>
						<label for="book_id">Référence du livre</label>
						<input type="text" id="book_id" name="book_id" value="" readonly required/>
						<button id="generate-code-button">Générer</button>
					</div>
					<div>
						<input class="primary" type="submit" value="Enregistrer le livre">
					</div>
				</form>
				</div>
			</div>
		    <div class="card">
                <div class="card-header">
				<legend>Vérifier l'existence d’un livre</legend>
				<form>
				</form>
			</div>
			<script src="script.js"></script>
		</div>
	</div>
</body>
</html>
