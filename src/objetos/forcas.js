import { Area } from "./area.js";

export class Forca {
    static G = 6.67428 * Math.pow(10, -11);
    static gravidade(p, m1, m2, x1, x2, y1, y2) {
        let v1 = p.createVector(x1, y1);
        let v2 = p.createVector(x2, y2);
        v2.sub(v1);
        let d = v2.mag();
        let m = (this.G * Math.pow(10,8) * m1 * m2) / (d * d);
        v2.normalize();
        v2.mult(m);
        return v2;
    }

    static atrito() {

    }

    static colisao(m1, m2, v1, v2) {
        let v = ((m1 - m2) / (m1 + m2)) * v1;
        v += ((2*m2) / (m1 + m2)) * v2;
        return v;
    }
}

export class GravidadeArea extends Area {
    constructor(p5, opcoes) {
        super(p5, opcoes);
        opcoes = opcoes || {};
        this._.f = opcoes.f || 0.1;
        this._.a = opcoes.a || 90;
    }

    aplicar(forma) {
        if (this.checarColisao(forma)) {
            forma.aplicarForca(Forca.gravidade(this._.p, this._.f, this._.a, forma.massa));
        }
    }

    desenhar() {
        this._.p.fill(255,255,255,255*0.1);
        this._.p.noStroke();
        this._.p.rect(this._.posicao.x, this._.posicao.y, this._.w, this._.h);
    }
}