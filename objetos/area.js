export class Area {
    constructor(processador, opcoes) {
        opcoes = opcoes || {};
        let _ = {};
        _.p = processador;
        _.aW = opcoes.aW !== undefined ? opcoes.aW : _.p.width;
        _.aH = opcoes.aH !== undefined ? opcoes.aH : _.p.height;
        let r = _.p.random(20, 100);
        _.w = opcoes.w !== undefined ? opcoes.w : r;
        _.h = opcoes.h !== undefined ? opcoes.h : r;
        _.posicao = _.p.createVector(
            opcoes.x !== undefined ? opcoes.x : _.p.random(_.aW - _.w),
            opcoes.y !== undefined ? opcoes.y : _.p.random(_.aH - _.h))
        this._ = _;
    }

    get x() { return this._.posicao.x; }
    get y() { return this._.posicao.y; }
    get p() { return this._.posicao; }
    get w() { return this._.w; }
    get h() { return this._.h; }
    get cX() { return this.esquerda + (this._.w/2); }
    get cY() { return this.superior + (this._.h/2); }
    get esquerda() { return this._.posicao.x; }
    set esquerda(v) { return this._.posicao.x = v; }
    get direita() { return this._.posicao.x + this._.w; }
    set direita(v) { return this._.posicao.x = v - this._.w; }
    get superior() { return this._.posicao.y; }
    set superior(v) { return this._.posicao.y = v; }
    get inferior() { return this._.posicao.y + this._.h; }
    set inferior(v) { return this._.posicao.y = v - this._.h; }


}
