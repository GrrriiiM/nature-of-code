import { Area } from "./area.js";
import { Forca } from "./forcas.js";

export class Mundo extends Area {
    constructor(processador, opcoes) {
        super(processador, opcoes);
        opcoes = opcoes || {};
        this._.formas = opcoes.formas || [];
    }

    atualizar() {
        this.aplicarGravidade();
        this.checarColisoes();
    }

    aplicarGravidade() {
        let copia = this._.formas.slice();
        while(copia.length) {
            let forma1 = copia[0];
            for(let i=1;i<copia.length;i++) {
                let forma2 = copia[i];
                let g1 = Forca.gravidade(this._.p, forma1.massa, forma2.massa, forma1.cX, forma2.cX, forma1.cY, forma2.cY);
                let g2 = Forca.gravidade(this._.p, forma2.massa, forma1.massa, forma2.cX, forma1.cX, forma2.cY, forma1.cY);
                forma1.aplicarForca(g1);
                forma2.aplicarForca(g2);
            }
            copia.splice(0,1);
        }
    }

    checarColisoes() {
        let copia = this._.formas.slice();
        while(copia.length) {
            let forma1 = copia[0];
            for(let i=1;i<copia.length;i++) {
                let forma2 = copia[i];
                if (this.checarColisaoV(forma1, forma2) && this.checarColisaoH(forma1, forma2)) {
                    forma1.vX = Forca.colisao(forma1.massa, forma2.massa, forma1.vX, forma2.vX);
                    forma2.vX = Forca.colisao(forma2.massa, forma1.massa, forma2.vX, forma1.vX);
                    forma1.vY = Forca.colisao(forma1.massa, forma2.massa, forma1.vY, forma2.vY);
                    forma2.vY = Forca.colisao(forma2.massa, forma1.massa, forma2.vY, forma1.vY);
                }
            }
            copia.splice(0,1);
        }
    }

    checarColisaoV(forma1, forma2) {
        if (!forma1.solido || !forma1.solido) return false;
        if (forma1.direita > forma2.esquerda && forma1.esquerda < forma2.direita) {
            return true;
        }
    }

    checarColisaoH(forma1, forma2) {
        if (!forma1.solido || !forma1.solido) return false;
        if (forma1.inferior > forma2.superior && forma1.superior < forma2.inferior) {
            return true;
        }
    }

    desenhar() {
        this._.formas.forEach(_ => {
           _.desenhar(); 
        });
    }
}