class Bola {
    constructor(p5, option) {
        this._ = {};
        this._.p5 = p5;
        option = option ?? {};
        this._.n = option.n ?? 0 
        this._.h = option.h ?? 50;
        this._.w = option.w ?? 50;
        this._.posicao = p5.createVector(option.x ?? this._.p5.width * this._.p5.random(), option.y ?? this._.p5.height * this._.p5.random());
        this._.velocidade = p5.createVector(option.vX ?? p5.random(-5, 5), option.vY ??  p5.random(-5, 5));
        this._.cor = {};    
        this.colorirAleatoriamente();
    }

    desenhar() {
        this._.p5.fill(this._.cor);
        this._.p5.noStroke();
        this._.p5.ellipse(this._.posicao.x, this._.posicao.y, this._.h, this._.w);
    }

    mover() {
        this.bateuParede = false;
        if (this._.p5.mouseIsPressed) {
            let mouse = this._.p5.createVector(this._.p5.mouseX, this._.p5.mouseY);
            let direcao = p5.Vector.sub(mouse, this._.posicao);
            direcao.normalize();
            direcao.mult(0.5);
            this._.velocidade.add(direcao);
        } else {
            this._.velocidade.add(p5.Vector.random2D().mult(0.5));    
        }
        this._.velocidade.limit(10);
        this._.posicao.add(this._.velocidade);
        if (this._.posicao.x + this._.w/2 > this._.p5.width || this._.posicao.x - this._.w/2 < 0) 
        {
            this.bateuParede = true;
            this._.velocidade.x = this._.velocidade.x * -1;
        }
        if (this._.posicao.y + this._.h/2 > this._.p5.height || this._.posicao.y - this._.h/2 < 0) 
        {
            this.bateuParede = true;
            this._.velocidade.y = this._.velocidade.y * -1;
        }
    }

    colorirAleatoriamente() {
        
        let cor = {
            r: this._.p5.noise((this._.p5.frameCount + (this._.n * 10000)) * 0.01) * 255,
            g: this._.p5.noise((this._.p5.frameCount + (this._.n * 10000) + 1000) * 0.01) * 255,
            b: this._.p5.noise((this._.p5.frameCount + (this._.n * 10000) + 2000) * 0.01) * 255,
        }
        this._.cor = this._.p5.color(cor.r, cor.g, cor.b, 255 * 0.5);
    }
}

export { Bola };