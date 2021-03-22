
// --------------- Funciones principales ----------------- \\

function generar (){
    var datos = get_datos()
    var id = datos.ID
    var LonSalida = datos.LonSalida
    var salida = ca(id,LonSalida)
    imprimirSalida(salida)
}

// --------------------------------------------------------- \\

function get_datos (){

    IDRaw = document.getElementById("ID").value;
    LonSalidaRaw = document.getElementById("LonSalida").value;
    
    var ID = parseInt(IDRaw)
    var LonSalida = parseInt(LonSalidaRaw )

	var datos = {
		ID: ID,
		LonSalida: LonSalida,
	};
	return datos;
}

function ca(id, LonSalida){
    var prn = [[2, 6], [3, 7], [4, 8], [5, 9], [1, 9], [2, 10], [1, 8], [2, 9],[3, 10], [2, 3], [3, 4], [5, 6], 
    [6, 7], [7, 8], [8, 9], [9, 10],[1, 4], [2, 5], [3, 6], [4, 7], [5, 8], [6, 9], [1, 3], [4, 6],[5, 7], 
    [6, 8], [7, 9], [8, 10], [1, 6], [2, 7], [3, 8], [4, 9]];

    id = id-1
    var G2taps = prn[id]
    G2taps[0] = G2taps[0]-1; G2taps[1] = G2taps[1]-1

    var G1 = [0,0,1,0,0,0,0,0,0,1];
    var G2 = [0,1,1,0,0,1,0,1,1,1];

    // posiciones de G donde hay un 1
    var G1pos = G1.reduce((c, v, i) => v == 1 ? c.concat(i) : c, []); // [2,9]
    var G2pos = G2.reduce((c, v, i) => v == 1 ? c.concat(i) : c, []); // [1,2,5,7,8,9]

    console.log(G1pos,G2pos)

    var LSFR1 = [1,1,1,1,1,1,1,1,1,1];
    var LSFR2 = [1,1,1,1,1,1,1,1,1,1];

    var secuencia = [];

    var salida = ""

    for (var i = 0; i < LonSalida; i++){

        var ultimoBit = LSFR1[LSFR1.length-1];
        var tap1 = LSFR2[G2taps[0]]; var tap2 = LSFR2[G2taps[1]];
        
        var elemSecuencia = ultimoBit ^ tap1 ^ tap2
        secuencia.push(elemSecuencia); // se añade elemento a la secuencia C/A

        var r1 = 0; var r2 = 0; // realimentación
        for (var j = 0; j < G1pos.length; j++){
            r1 = r1 ^ LSFR1[G1pos[j]];
        }
        for (var k = 0; k < G2pos.length; k++){
            r2 = r2 ^ LSFR2[G2pos[k]];
        }
        salida += `${LSFR1.join("")} | ${r1} | ${LSFR2.join("")} | ${r2} | ${elemSecuencia}<br>`;

        LSFR1.unshift(r1);
        LSFR2.unshift(r2);
        LSFR1.pop();
        LSFR2.pop();
    }

    var salidas = {
        salida: salida,
        secuencia: secuencia
    }
    return salidas
}

function imprimirSalida(salida){

    document.getElementById("salida").innerHTML = salida.salida;
    document.getElementById("secuencia").innerHTML = salida.secuencia.join("  ");

    // Show / Hide
    var mostrar = document.getElementById("salidas");
    if (mostrar.style.display === "none") {
      mostrar.style.display = "block";
    } else {
      mostrar.style.display = "none";
    }
}