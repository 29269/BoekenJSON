const uitvoeren = document.getElementById('boeken');
const xhhtp = new XMLHttpRequest();

xhhtp.onreadystatechange = () => {
    if(xhhtp.readyState == 4 && xhhtp.status ==200)
    {
        let resultaat = JSON.parse(xhhtp.responseText);
        console.log(resultaat);
        // boeken.res
    }
}
xhhtp.open('GET', 'boeken.json', true);
xhhtp.send();

// const boeken ={
//     uitvoer(){

//     }
// }