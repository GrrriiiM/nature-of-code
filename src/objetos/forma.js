
class Forma {
    constructor(p5, options) {
        options = options || {};
        let _ = {};
        _.p5 = p5;
        _.aW = options.aW || p5.width;
        _.aH = options.aH || p5.height;
        let r = p5.random(20, 100);
        _.w = options.w || r;
        _.h = options.h || r;
        _.posicao = p5.createVector(
            options.x ||  p5.random(_.aW),
            options.y ||  p5.random(_.aH));
        _.m = options.m || (_.w * _.h) / 100;
        _.cor = p5.color(255); 
        _.aceleracao = p5.createVector(0, 0);
        _.velocidade = p5.createVector(0, 0);
        _.aMax = 5;
        this._ = _;
    }

    get p5() { return this._.p5; }
    get x() { return this._.posicao.x; }
    get y() { return this._.posicao.y; }
    get m() { return this._.m; }

    desenhar() {
        this._.aceleracao.limit(this._.aMax);
        this._.velocidade.add(this._.aceleracao);
        this._.posicao.add(this._.velocidade);
        this.checarColisao();
        this._desenhar();
        this._.aceleracao.mult(0);
    }

    checarColisao() {
        if (this._.posicao.x > this._.p5.width - this._.w/2) {
            this._.velocidade.x = this._.velocidade.x * -1
            this._.posicao.x = this._.p5.width - this._.w/2
        }
        else if (this._.posicao.x < this._.w/2) {
            this._.velocidade.x = this._.velocidade.x * -1
            this._.posicao.x = this._.w/2
        }
        if (this._.posicao.y > this._.p5.height - this._.h/2) {
            this._.velocidade.y = this._.velocidade.y * -1
            this._.posicao.y = this._.p5.height - this._.h/2
        }
        else if (this._.posicao.y < this._.h/2) {
            this._.velocidade.y = this._.velocidade.y * -1
            this._.posicao.y = this._.h/2
        }
    }

    aplicarForca(forca) {
        let f = this.p5.createVector(forca.x, forca.y);
        let a = f.div(this._.m);
        this._.aceleracao.add(a);
    }
}

class Elipse extends Forma {
    constructor(p5, options) {
        super(p5, options);
    }

    _desenhar() {
        this.p5.fill(this._.cor);
        this.p5.noStroke();
        this.p5.ellipse(this._.posicao.x, this._.posicao.y, this._.h, this._.w);
    }
}

class Retangulo extends Forma {
    constructor(p5, options) {
        super(p5, options);
    }

    _desenhar() {
        this.p5.fill(this._.cor);
        this.p5.noStroke();
        this.p5.rect(this._.posicao.x, this._.posicao.y, this._.h, this._.w);
    }
}

export { Elipse, Retangulo };