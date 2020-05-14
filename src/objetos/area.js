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
            opcoes.x !== undefined ? opcoes.x : _.p.random(_.aW),
            opcoes.y !== undefined ? opcoes.y : _.p.random(_.aH))
        this._ = _;
    }

    get esquerda() { return this._.posicao.x; }
    get direita() { return this._.posicao.x + this._.w; }
    get superior() { return this._.posicao.y; }
    get inferior() { return this._.posicao.y + this._.h; }

    checarColisao(forma) {
        return this.esquerda < forma.direita
            && this.direita > forma.esquerda
            && this.superior < forma.inferior
            && this.inferior > forma.superior;
    }
}