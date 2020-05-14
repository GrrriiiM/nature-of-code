import { Area } from "./area.js";

export class Gravidade extends Area {
    constructor(p5, opcoes) {
        super(p5, opcoes);
        opcoes = opcoes || {};
        this._.f = opcoes.f || 0.1;
        this._.a = opcoes.a || 90;
    }

    aplicar(forma) {
        if (this.checarColisao(forma)) {
            let f = p5.Vector.fromAngle(this._.p.radians(this._.a), this._.f);
            f.mult(forma.massa);
            forma.aplicarForca(f)
        }
    }

    desenhar() {
        this._.p.fill(255,255,255,255*0.1);
        this._.p.noStroke();
        this._.p.rect(this._.posicao.x, this._.posicao.y, this._.w, this._.h);
    }
}