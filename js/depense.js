//partie description
const formulaire = document.querySelector("#formulaire");
const champDescription = document.querySelector("#descriptionDepense");
const montantInput = document.querySelector("#montant");
const champCategorie = document.querySelector("#categorie");
const champDate =document.querySelector("#dates");


function ajoutDescription(){
    let description = champDescription.value.trim();

    if(description === ""){
        alert("Description invalide");
        return false;
    }else{
        return true;
    } 
}

//Partie montant
function ajoutMontant(){
    const montant = Number(montantInput.value);

    if(montantInput.value.trim() === "" || !Number.isFinite(montant) || montant <=   0){
        return false;
    } else{
        return true;
    }
}

//Partie catégorie 
function ajoutCategorie(){
    const categorie = champCategorie.value;

    if(categorie !== ""){
        return true;
    } else{
        return false;
    }
}

//date
function enregDate(){
    const date = champDate.value;

    if(date === ""){
        return false;
    }
    return true;
}

//validation
formulaire.addEventListener('submit', (event) => {
    event.preventDefault();

    if(!ajoutDescription() || !ajoutMontant() || !ajoutCategorie() || !enregDate()){
        return;
    } else{
        add();
    }
    
});


//Ajout dynamique
function add(){
    const description = champDescription.value.trim();
    const montant = Number(montantInput.value);
    const categorie = champCategorie.value;
    const date = champDate.value;

    if(description === "" || !Number.isFinite(montant) || montant <= 0 || categorie === "" || date === ""){
        alert("champ vide");
        return;
    }

    const depense = {
        description : description,
        montant : montant,
        categorie : categorie,
        date : date
    };

    let depenses = JSON.parse(localStorage.getItem("depenses")) || [];
    depenses.push(depense);

    localStorage.setItem("depenses", JSON.stringify(depenses));

    window.location.href = "historique.html"
}
