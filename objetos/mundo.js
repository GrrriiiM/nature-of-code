import { Area } from "./area.js";
import { Forca } from "./forcas.js";

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
                interacao.call(this, forma1, copia[i]);
            }
            copia.splice(0,1);
        }
    }

    atualizar() {
        this._.formas.forEach(_ => this.aplicarColicoesParede(_));
        this.aplicarGravidade(this._.formas[0], this._.formas[1]);
        this.formasInteracao(this.aplicarGravidade);
        this.formasInteracao(this.aplicarColisoes);
        this._.formas.forEach(_ => _.atualizar())
        this.formasInteracao(this.corrigirColisoes);
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
            let theta1 = forma1.v.heading();
            let theta2 = forma2.v.heading();
            let phi = Math.atan2(forma2.cY - forma1.cY, forma2.cX - forma1.cX);
            let m1 = forma1.m;
            let m2 = forma2.m;
            let v1 = forma1.v.mag();
            let v2 = forma2.v.mag();

            let dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
            let dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
            let dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
            let dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

            forma1.v.x = dx1F;                
            forma1.v.y = dy1F;                
            forma2.v.x = dx2F; 
            forma2.v.y = dy2F;
        
            //staticCollision(ob1, ob2)
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
        if (!forma1.solido || !forma1.solido) return false;
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