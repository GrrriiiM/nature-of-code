import { Elipse } from "./formas.js";

const terra = (processador) => new Elipse(processador, { 
    m: 5972 * 10**24, 
    w: 50, h: 50, 
    x: processador.width/2 - 25, 
    y: 6371000000, 
    colidirParede: false 
})

const gravidades = {
    criarTerra: terra 
};

export default gravidades;