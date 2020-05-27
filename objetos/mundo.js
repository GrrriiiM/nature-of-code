import { Area } from "./area.js";
import { Forca } from "./forcas.js";
import { Elipse } from "./formas.js";

export class Mundo extends Area {
    constructor(processador, opcoes) {
        opcoes = opcoes || {};
        opcoes.aW = opcoes.aW !== undefined ? opcoes.aW : processador.width;
        opcoes.aH = opcoes.aH !== undefined ? opcoes.aH : processador.height;
        opcoes.w = opcoes.w !== undefined ? opcoes.w : opcoes.aW;
        opcoes.h = opcoes.h !== undefined ? opcoes.h : opcoes.aH;
        opcoes.x = opcoes.x !== undefined ? opcoes.x : 0;
        opcoes.y = opcoes.y !== undefined ? opcoes.y : 0;
        super(processador, opcoes);

        this._.formas = opcoes.formas || [];
    }

    

    formasInteracao(interacao) {
        let copia = this._.formas.slice();
        while(copia.length) {
            let forma1 = copia[0];
            for(let i=1;i<copia.length;i++) {
                let forma2 = copia[i];
                if (forma1 && forma2)
                    interacao.call(this, forma1, forma2);
            }
            copia.splice(0,1);
        }
    }

    atualizar() {
        this._.formas.forEach(_ => this.aplicarColicoesParede(_));
        this.formasInteracao(this.aplicarGravidade);
        this.formasInteracao(this.aplicarColisoes);
        this._.formas.forEach(_ => _.atualizar())
        this.formasInteracao(this.corrigirColisoes);
    }

    resolverColicao(forma1, forma2) {
        let rv = forma2.v.copy().sub(forma1);
        
    }

    aplicarGravidade(forma1, forma2) {
        let g1 = Forca.gravidade(this._.p, forma1.m, forma2.m, forma1.cX, forma2.cX, forma1.cY, forma2.cY);
        let g2 = Forca.gravidade(this._.p, forma2.m, forma1.m, forma2.cX, forma1.cX, forma2.cY, forma1.cY);
        forma1.aplicarForca(g1);
        forma2.aplicarForca(g2);
    }

    corrigirColisoes(forma1, forma2) {
        if (this.checarColisao(forma1, forma2)) {
            this.corrigirColiscao(forma1, forma2);
            this.corrigirColiscao(forma2, forma1);
        }
    }

    aplicarColisoes(forma1, forma2) {
        if (this.checarColisao(forma1, forma2)) {
            this.aplicarColisao(forma1, forma2);
        }
    }

    aplicarColisao(forma1, forma2) {

        if (this.checarColisao(forma1, forma2)) {
            
            let p1 = Forca.colisao(
                forma1.m, forma2.m, 
                forma1.cX, forma2.cX, 
                forma1.cY, forma2.cY, 
                forma1.v.mag(), forma2.v.mag(), 
                forma1.v.heading(), forma2.v.heading());
        
            let p2 = Forca.colisao(
                forma2.m, forma1.m, 
                forma2.cX, forma1.cX, 
                forma2.cY, forma1.cY, 
                forma2.v.mag(), forma1.v.mag(), 
                forma2.v.heading(), forma1.v.heading());

                forma1.v.set(p1.x, p1.y);
                forma2.v.set(p2.x, p2.y);
            
        }
    }

    aplicarColicoesParede(forma) {
        if (forma.colidirParede) {
            if (forma.esquerda < this.esquerda) {
                forma.esquerda = this.esquerda;
                forma.vX = forma.vX * -1;
            }
            if (forma.direita > this.direita) {
                forma.direira = this.direita;
                forma.vX = forma.vX * -1;
            }
            if (forma.superior < this.superior) {
                forma.superior = this.superior;
                forma.vY = forma.vY * -1;
            }
            if (forma.inferior > this.inferior) {
                forma.inferior = this.inferior;
                forma.vY = forma.vY * -1;
            }
        }
    } 

    checarColisao(forma1, forma2) {
        if (!forma1.solido || !forma2.solido) return false;
        let dist = this._.p.dist(forma1.cX, forma1.cY, forma2.cX, forma2.cY);
        let espaco =  dist - (forma1.w/2 + forma2.w/2);
        return espaco <= 0;
    }


    corrigirColiscao(forma1, forma2) {
        let dist = this._.p.dist(forma1.cX, forma1.cY, forma2.cX, forma2.cY);
        let espaco =  dist - (forma1.w/2 + forma2.w/2);
        let a = ((forma1.v.mag() / (forma1.v.mag() + forma2.v.mag()))) * espaco;
        let dir = forma1.v.copy().normalize().mult(a*-1);
        forma1.p.sub(dir);
    }

    desenhar() {
        this._.formas.forEach(_ => {
           _.desenhar(); 
        });
    }
}