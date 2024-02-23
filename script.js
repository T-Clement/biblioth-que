document.addEventListener("DOMContentLoaded", function () {
    // Traiter ici la partie Javascript/AJAX de l'exercice

    // ajouter un appel à API
    // mais laisser la possibilité de rajouter manuellement et là il faut faire les différents controles
    // sur l'input

    //référence du livre : 2 premierees lettres du titre du livre (pas d'apostrophes), 2 premieres du nom de l'auteur
    // et de 4 chiffres aléatoires.

    // Exemple pour le livre "Croc-Blanc" de Jack London : CRLO1234

    // Référence doit être unique à chaque livre -> asynchrone pour vérifier en base

    // contrôles sur les valeurs d'input envoyées par les formulaires

    // ajouter une limite de réponses dans le front qui est prise en compte en JS

    const addTitleBookInput = document.getElementById("title");
    const addAuthorBookInput = document.getElementById("author");
    const bookIdInput = document.getElementById("book_id");

    

    let timer;

    addTitleBookInput.addEventListener("keyup", function (e) {
		bookIdInput.value = "";
		addAuthorBookInput.value = "";

		if(e.target.value.length < 3) {
			document.getElementById("title-suggestions").innerHTML = "";
			return;
		}




		// check if api search is checked / activate
		if (!document.querySelector("#api-activation:checked")) {
			document.getElementById("title-suggestions").style.display =
				"none";
			return;
		}
		clearTimeout(timer);

		timer = setTimeout(function () {
			const titleSuggestions =
				document.getElementById("title-suggestions");
			titleSuggestions.style.display = "block";
			// RESET ALL FORM VALUES (NOT TITLE) IF CHANGE IN FORM FIELD
			if (e.target.value.length < 3) return;
			titleSuggestions.innerHTML = "<li id='spinner' class='list-group-item'><span id='loader'></span></li>";

			

			getTitlesFromApi(e.target.value).then((response) => {
				// remove loading spinner
				if(document.getElementById("spinner")) {
					document.getElementById("spinner").remove();
				}

				// loop thrue api response
				response.docs.forEach((element) => {
					// console.log(element["title_suggest"]);

					const li = document.createElement("li");
					li.innerText = element["title_suggest"];
					li.classList.add("list-group-item", "list-group-item-action");

					li.addEventListener("click", function (e) {
						addTitleBookInput.value = element["title_suggest"];
						addAuthorBookInput.value =
							element["author_name"][0]; // author_name is an array
						titleSuggestions.innerHTML = "";

						bookIdInput.value = generateUniqBookId(
							addTitleBookInput,
							addAuthorBookInput
						);
					}); // END OF CLICK EVENT LISTENER

					titleSuggestions.appendChild(li);
				}); // END OF FOREACH
			}); // END OF GET TITLE FROM API
		}, 500); //  END OF TIME OUT
	}); // END OF KEYUP EVENT LISTENER


    // ------------------------------------------------------
    // ------------ ADD BOOK FORM SUBMISSION -------------- //
    const addBookForm = document.getElementById("add-book-form");
    addBookForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let formData = new FormData(addBookForm);

        const title = formData.get("title");
        const author = formData.get("author");
        const bookId = formData.get("book_id");

		if(bookId.length < 7 || bookId === null) {
			showToast("Vous devez générer une référence de livre en cliquant sur le bouton Générer" , false);
			return
		}

        // IF NO ISSUE
        registerBookToDatabase(bookId, author, title).then((response) => {
            // console.log(response);

            if (!response.state) {
                // display hint about error for user
				showToast(response.message, response.state);
            } else {
                // id state at true, display message

                showToast(response.message, response.state);

                // reset values of inputs in add book form
                document.getElementById("title").value = "";
                document.getElementById("author").value = "";
                document.getElementById("book_id").value = "";
            }
        }); // END OF REGISTER BOOK IN DATABASE

    }); // END OF SUBMIT FORM




    let generateCodeButton = document.getElementById("generate-code-button");
    generateCodeButton.addEventListener("click", function (e) {
        
		e.preventDefault();
        
		if (addTitleBookInput.value === "" || addTitleBookInput.value.length < 2) {
            showToast("Titre trop court pour être enregistré", false);
            addTitleBookInput.focus();
            return;
        }

        if (addAuthorBookInput.value === "" || addAuthorBookInput.value.length < 2) {
            showToast("Nom d'auteur trop court pour être enregistré", false);
            addAuthorBookInput.focus();
            return;
        }

        bookIdInput.value = generateUniqBookId(addTitleBookInput, addAuthorBookInput);
    }); // END OFF GENERATE REFERENCE


	// -------------------------------------------------------
	// remove list when api activation has been desactivated
	document.getElementById("api-activation").addEventListener("click", function(e){
		// console.log("c'est cliqué");
		if(!document.getElementById("api-activation:checked")) {
			document.getElementById("title-suggestions").innerHTML = "";
		}
	}); // END OFF API CHECK CLICK 


	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// CHECK BOOK REFERENCE IN DATABASE
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------

	document.getElementById("search").addEventListener("keyup", e => {
		e.preventDefault();

		// reset results from previous query
		document.getElementById("search-results").innerHTML = "";
		document.getElementById("book-reference").innerText = "";
		document.getElementById("book-author").innerText = "";
		document.getElementById("book-title").innerText ="";
		
		if(e.target.value === "") return;

		// check in database the references of books related to input value
		checkBookReferenceInDataBase(e.target.value).then((response) => {
			// console.log(response.data);

			
			// if no match 
			if(response.data.length === 0) {
				const li = document.createElement("li");
				li.classList.add("list-group-item", "list-group-item-action");
				li.textContent = "Aucune correspondance";
				
				// append li to search-results list
				document.getElementById("search-results").appendChild(li);
				return;
			} else {
				// loop thrue each result
				response.data.forEach(book => {
					
					const li = document.createElement("li");
					li.classList.add("list-group-item", "list-group-item-action");
					li.textContent = book.reference;
	
	
					// fetch Book data from database when click on list-item
					li.addEventListener("click", function(e) {
						getBookDetails(book.reference).then(response => {
							document.getElementById("book-reference").innerText = response.data.reference;
							document.getElementById("book-author").innerText = response.data.auteur;
							document.getElementById("book-title").innerText = response.data.titre;
	
						});
					});
	
					// append li to search-results list
					document.getElementById("search-results").appendChild(li);
				}) // END OF FOREACH

			} // END OF IF/ELSE STATEMENT ABOUT MATCH IN DATABASE

		}); // END OF CHECK BOOK REFERENCE IN DATABASE

	}); // END OF KEYUP EVENT LISTENER


}); // END OF DOMCONTENTLOADED EVENT LISTENER

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------



// -------------------------------------------- //
// -------------------------------------------- //
// ---------------- FUNCTIONS ------------------ //
// -------------------------------------------- //
// -------------------------------------------- //

function getBookDetails(reference) {
	const data = {
		"action": "get_database_book_data",
		"reference": reference
	};
	return callAPI("POST", data);
}


function checkBookReferenceInDataBase(code) {
	const data = {
		"action": "check_book_reference",
		"reference": code
	};

	return callAPI("POST", data);
}


function registerBookToDatabase(bookId, bookAuthor, bookTitle) {
	const data = {
		action: "register_book",
		id_book: bookId,
		author: bookAuthor,
		title: bookTitle,
	};

	return callAPI("POST", data);
}


async function callAPI(method, data) {
    try {
        const response = await fetch("cible/api.php", {
            method: method,
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    } catch (error) {
        console.error("Unable to fetch datas from API : " + error);
    }
}



async function getTitlesFromApi(string) {
    try {
        const response = await fetch(
            `https://openlibrary.org/search.json?title=${string}&language=fre&limit=20`
        );
        // const response = await fetch(`https://openlibrary.org/search/authors.json?q=${string}`);
        return response.json();
    } catch (error) {
        console.error("Unable to fetch datas from API : " + error);
    }
}


function generateUniqBookId(titleInput, authorInput) {
    document.getElementById("book_id").value = "";
    const regex = /[\W]/g;

    let authorValue = authorInput.value;
    console.info(authorValue);
    let authorValueClean = authorValue.replace(regex, ""); // clean input value
    console.info(authorValueClean);

    let authorCode = authorValueClean.substring(0, 2);

    let titleValue = titleInput.value;
    let titleValueClean = titleValue.replace(regex, ""); // clean input value
    let titleCode = titleValueClean.substring(0, 2);

    let randomNumber = Math.floor(Math.random() * 10000);
    let randomFourDigitsNumber = randomNumber.toString().padStart(4, "0"); // add 0 to left of number if needed

    return new String(
        (authorCode + titleCode + randomFourDigitsNumber).toUpperCase()
    );
}



function showToast(message, state) {
    var x = document.getElementById("toast");
    if (state) {
        x.className = "show show-success";
    } else {
        x.className = "show show-danger";
    }
    x.innerText = message;
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

