const uitvoeren = document.getElementById('boeken');
const xhhtp = new XMLHttpRequest();
//checkboxen voor de taal filter
const taalKeuzen = document.querySelectorAll('.besturing__cb-taal');
// voor keuze sorteren
const selectSort = document.querySelector('.besturing__select');
const  aantalbestlling = document.querySelector('.winkelwagen__aantal');
xhhtp.onreadystatechange = () => {
    if(xhhtp.readyState == 4 && xhhtp.status ==200)
    {
        let resultaat = JSON.parse(xhhtp.responseText);
        // boeken.data = resultaat;
        boeken.filteren( resultaat );
        boeken.uitvoer();
    }
};
xhhtp.open('GET', 'boeken.json', true);
xhhtp.send();
///object winkelwagen
///met eigenschappen: bestelling(boeken )
/// en methods: data ophalen , boeken toevoegen ,uitvoeren
const winkelwagen ={
    bestelling:[],
    // data opslaan o de localStorage
    boekToevoegen(obj){
        winkelwagen.bestelling.push(obj);
        aantalbestlling.innerHTML = this.bestelling.length;
        localStorage.wwBestelling = JSON.stringify(this.bestelling);
    },
    uitvoeren(){

        let html = '<table>';
        let totaal = 0;
        this.bestelling.forEach( boek => {
            let compeltTitel = "";
            if ( boek.voortitel){
                compeltTitel += boek.voortitel + " ";
            }
            compeltTitel += boek.titel;
            html += '<tr>';
            html += `<td><img src="${boek.cover}" alt="${compeltTitel}" class="bestellingFormulier__cover"><td>`;
            html +=`<td>${compeltTitel}</td>`;
            html +=`<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`;
            html += '<tr>';
            totaal += boek.prijs;
        });
        html += `<tr><td colspan="3">Totaal</td>
          <td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td></tr>`;
        html += '</table>';
        document.getElementById('uitvoer').innerHTML = html;
        aantalbestlling.innerHTML = winkelwagen.bestelling.length;
    },


    dataOphalen(){
        if (localStorage.wwBestelling){
                this.bestelling=JSON.parse(localStorage.wwBestelling);
            this.uitvoeren();

    }}
};
winkelwagen.dataOphalen();
// de localStorage werkt niet

///object boeken
///met eigenschappen: taalFilter, data, eigenschapsorteren
/// en methods: filteren, sorteren, uitvoer
const boeken ={
    esSorteren: 'titel', //eigenschapsorteren
    taalFilter: ['Engels', 'Duits' , 'Nederlands'],
    oplopend: 1,

    // filteren op een taal {engels, nederland en duits}
    filteren(gegevens){
      // this.data = gegevens.filter((book) => {return book.taal == this.taalFilter });
        this.data = gegevens.filter((book) => {
            let bool = false;
            this.taalFilter.forEach( (taal) => {
                if(book.taal == taal){
                  bool = true;
                }
            })
            return bool

        })
    },
    sorteren() {
        if (this.esSorteren == 'titel') {
            this.data.sort((a,b) => (a.titel.toUpperCase() > b.titel.toUpperCase()) ? this.oplopend : -1*this.oplopend);
        } else if (this.esSorteren == 'paginas') {
            this.data.sort((a,b) => (a.paginas > b.paginas) ? this.oplopend : -1*this.oplopend);
        } else if (this.esSorteren == 'uitgave') {
            this.data.sort((a,b) => (a.uitgave > b.uitgave) ? this.oplopend : -1*this.oplopend);
        }else if (this.esSorteren == 'prijs') {
            this.data.sort((a,b) => (a.prijs > b.prijs) ? this.oplopend : -1*this.oplopend);
        }
        else if (this.esSorteren == 'auteur') {
            this.data.sort((a,b) => ( a.auteurs[0].achternaam > b.auteurs[0].achternaam) ? this.oplopend : -1*this.oplopend);
        }

    },

        // er wordt hier een eigenschap data aangemaakt
        uitvoer() {
        //sorteren
            this.sorteren();
        let mtHtml = "";
        this.data.forEach(boek => {

            //in het geval van een voortitel moet deze voor de titel worden geplaatst
            let titel = "";
            if (boek.voortitel){
                titel += boek.voortitel + " ";
            }
             titel += boek.titel;
            //een lijst met auteurs maken
            let auteurs = "";
            boek.auteurs.forEach((schrijver,index) => {
                let tv = schrijver.tussenvoegsel ? schrijver.tussenvoegsel+" " : "";
                //het scheidingteken tussen de auteurs
                let separator = ", ";
                if (index >= boek.auteurs.length-2 ){ separator = " en "; }
                if (index >= boek.auteurs.length-1 ){ separator = ""; }
                auteurs += schrijver.voornaam + " "+ tv + schrijver.achternaam + separator;
            })

            //html toevoegen
            mtHtml += `<section class="boek">`;
            mtHtml += `<img class="boek__cover" src="${boek.cover}" alt="${titel}">`;
            mtHtml +=`<div class="boek__info">`;
            mtHtml += `<h3 class="boek__kopje">${titel}</h3>`;
            mtHtml += `<p class="boek__auteurs">${auteurs}</p> `
            mtHtml += `<span class="boek__uitgave">  ${this.datumOmzetten(boek.uitgave)}</span>`;
            mtHtml += `<span class="boek__ean"> Ean: ${boek.ean}</span>`;
            mtHtml += `<span class="boek__paginas"> ${boek.paginas} Pagina's</span>`;
            mtHtml += `<span class="boek__taal">${boek.taal}</span>`;
            mtHtml += `<div class="boek__prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}
                        <a href="#" class="boek__bestel-knop" data-role="${boek.ean}">bestellen</a></div>`;
            mtHtml += `</div></section>`;
        });
        uitvoeren.innerHTML = mtHtml;
        // de gemaakte knoppen voorzien van eventListener
            document.querySelectorAll('.boek__bestel-knop').forEach(knop =>
            knop.addEventListener('click', e =>{
                e.preventDefault();
                let boekID = e.target.getAttribute('data-role');
                let gekliktBoek = this.data.filter(b => b.ean == boekID);
                winkelwagen.boekToevoegen(gekliktBoek[0]);


            })
            );
    },
    datumOmzetten(datumString){
       let datum = new Date(datumString);
       let jaar = datum.getFullYear();
       let maand = this.maandNaam(datum.getMonth());
       return `${maand} ${jaar}`;
    },
    maandNaam(m){
            let maand= "";
            switch (m) {
                case 0 : maand =' januari'; break ;
                case 1 : maand =' februari'; break ;
                case 2 : maand =' maart'; break ;
                case 3 : maand =' april '; break ;
                case 4 : maand =' mei '; break ;
                case 5 : maand =' juni '; break ;
                case 6 : maand =' juli '; break ;
                case 7 : maand =' augustus '; break ;
                case 8 : maand =' september '; break ;
                case 9 : maand =' oktober '; break ;
                case 10 : maand =' november '; break ;
                case 11 : maand =' december '; break ;
                default : maand = m;

            }
            return maand;
    }
}

const pasFilterenAan = () => {
let gecheckteTaal = [];
taalKeuzen.forEach(cb => {
    if(cb.checked) gecheckteTaal.push ( cb.value);
});
boeken.taalFilter = gecheckteTaal;
boeken.filteren(JSON.parse(xhhtp.responseText));
boeken.uitvoer();
}
const pasSortAan = () => {
boeken.esSorteren = selectSort.value;
boeken.uitvoer();
}

taalKeuzen.forEach(cb => cb.addEventListener('change', pasFilterenAan) );
selectSort.addEventListener('change', pasSortAan);
document.querySelectorAll('.besturing__rb').forEach(rb => rb.addEventListener('change', () => {
    boeken.oplopend = rb.value;
    boeken.uitvoer();
}))