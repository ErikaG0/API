var artyom = new Artyom()
var equipo
var country
var equipoID
var namePer

const aldeas = {
    "Konohagakure": "konoha.png",
    "Sunagakure": "sunagakure.png",
    "Kirigakure": "Kirigakure.png",
    "Iwagakure": "Iwagakure.webp",
    "Kumogakure": "Kumogakure.webp"
};

$("#activar").click(function () {
    artyom.initialize({
        lang: "es-ES",
        debug: true,
        listen: true,
        continuous: true,
        speed: 0.9,
        mode: "normal"
    });
});

artyom.addCommands({
    indexes: [""],
    action: function () {
    }
});

artyom.redirectRecognizedTextOutput(function (recognized, isFinal) {
    if (isFinal) {
        console.log("Texto final reconocido:" + recognized);
        //name
        $.ajax({
            url: "https://narutodb.xyz/api/character/search?name=" + recognized,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                mostrarInfo(data)
            }
        })
        //id
        $.ajax({
            url: "https://narutodb.xyz/api/character/" + recognized,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                mostrarInfo(data)
            }
        })
    } else {
        console.log("Texto intermedio:", recognized);
    }
});


function mostrarInfo(data) {
    console.log(data.id)
    country = Array.isArray(data.personal.affiliation) ? data.personal.affiliation[0] : data.personal.affiliation;
    console.log(country);
    if (aldeas.hasOwnProperty(country)) {
        const imagen = aldeas[country];
        $("#ponImgC").attr("src", `img/${imagen}`);
    } else {
        console.log("No se encontro la aldea.");
    }

    $("#img-box").attr("src", data.images[1] !== undefined ? data.images[1] : data.images[0]);
  
    console.log(data.images[1]);
  
    $("#info").html
        (` <p class="card-text pInfoN"  > ${data.name} </p> 
        ${data.rank && data.rank.ninjaRegistration !== undefined ? ` <p class="card-text pInfo" ><strong>Registration:</strong>  ${data.rank.ninjaRegistration}` : ''}  
        ${data.personal.bloodType !== undefined ? ` <p class="card-text pInfo" ><strong>BloodType:</strong> ${data.personal.bloodType}` : ''}  
        ${data.personal && data.personal.height !== undefined ? `<p class="card-text pInfo"><strong>Height:</strong> ${data.personal.height["Blank Period"] || data.personal.height["Part II"] || data.personal.height["Part I"]}</p>` : ''}
        ${data.personal && data.personal.weight !== undefined ? `<p class="card-text pInfo"><strong>Weight:</strong> ${data.personal.weight["Blank Period"] || data.personal.weight["Part II"] || data.personal.weight["Part I"]}</p>` : ''}
        ${data.personal && data.personal.occupation !== undefined && (Array.isArray(data.personal.occupation) && data.personal.occupation.length > 0) ? `<p class="card-text pInfo"><strong>Occupation:</strong>${data.personal.occupation[0]}</p>` : (data.personal && data.personal.occupation !== undefined ? `<p class="card-text pInfo" ><strong>Occupation</strong> ${data.personal.occupation}</p>` : '')}
        `);

    $("#moreInfo").html
        (` 
        ${data.personal.kekkeiGenkai !== undefined ? `<p class="card-text pInfo"><strong>KekkeiGenkai: </strong> ${data.personal.kekkeiGenkai}</p>` : ''} 
        ${data.natureType !== undefined ? `<p class="card-text pInfo"><strong>NatureType: </strong>${data.natureType}</p>` : ''} 
        ${data.personal && data.personal.classification !== undefined && (Array.isArray(data.personal.classification) && data.personal.classification.length > 0) ? `<p class="card-text pInfo"><strong>Classification: </strong>${data.personal.classification[0]}</p>` : (data.personal && data.personal.classification !== undefined ? `<p class="card-text pInfo" ><strong>Classification: </strong> ${data.personal.classification}</p>` : '')}
        ${data.tools !== undefined ? `<p class="card-text pInfo"><strong>Tools: </strong> ${data.tools.length}</p>` : ''} 
        ${data.jutsu && Array.isArray(data.jutsu) ? `<p class="card-text pInfo"><strong>Jutsu Count: </strong>${data.jutsu.length}</p>` : ''}

        `);
 namePer=data.name
    equipo = Array.isArray(data.personal.team) ? data.personal.team[0] : data.personal.team;
    if (equipo) {
        $.ajax({
            url: "https://narutodb.xyz/api/team?page=1&limit=190",
            type: "GET",
            contentType: "application/json",
            success: function (dataT) {
                console.log(dataT)
                teamsT(dataT)
            }
        })
    }else {
        // Si el personaje no tiene equipo, limpiamos las imágenes y los nombres de los personajes
        for (var j = 0; j < 3; j++) {
            $("#int" + j).addClass("img-hidden");
            $("#p" + j).text("");
            $("#teamT").text("");
        }
}
}

function teamsT(dataT) {
    
    var equipoEncontrado = null;
    for (var i = 0; i < dataT.teams.length; i++) {
        if (dataT.teams[i].name == equipo) {
            equipoEncontrado = dataT.teams[i];
           console.log("primer for " +JSON.stringify(equipoEncontrado))
            //console.log(dataT.teams[i].name)
            $("#teamT").empty().append("TEAM  "+ dataT.teams[i].name)
            break;
        }
    }

    if (equipoEncontrado !== null  ) {
       
        var integrantesEquipo = equipoEncontrado.characters.filter(character => character.name !== namePer);
      //  console.log("segundo", integrantesEquipo)
        // Mostrar hasta tres integrantes restantes del equipo
        for (var j = 0; j < Math.min(integrantesEquipo.length, 3); j++) {
            var integrante = integrantesEquipo[j];
            $("#int" + j).attr("src", integrante.images[0]).removeClass("img-hidden");
            $("#p" + j).text(integrante.name);
        }
    }
}
//box
$(document).ready(function () {
    $("#search").on("click", function () {
        //ejecuta un llamado asincrono 
        $.ajax({
            url: "https://narutodb.xyz/api/character/search?name=" + $("#searchInput").val(),
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                $("#alertM").addClass("img-hidden");
                mostrarInfo(data)
            },
            error: function(xhr, status, error) {
                if(xhr.status == 404) {
                   // console.log("Error", status)
                } else {
                      $("#alertM").removeClass("img-hidden");
                   $("#alertM").html(
                    `
                    <div class="alert alert-danger" role="alert">
    <i class="fas fa-exclamation-triangle"></i>
         Error 404  No encontrado
  </div>
                    `

                   )
                }
            }
        })
    })
})
