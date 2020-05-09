class Grafico {
    constructor(p5, option) {
        option = option || {};
        this._ = {
            p5: p5,
            h: option.h || 50,
            w: option.w || 50,
            x: option.x || 0,
            y: option.y || 0,
            maxP: option.maxP || 50,
            ps: []
        };
    }

    novo() {
        if (this._.ps.length > this._.maxP) this._.ps.splice(0,1);
    }

    desenhar() {
        this._.p5.fill(0);
        this._.p5.stroke(0);
        this._.p5.rect(this._.x, this._.y, this._.w, this._.h)
        let max = this._.ps.reduce((p, c) => p > c ? p : c, 0);
        let min = this._.ps.reduce((p, c) => p < c ? p : c, this._h);
        this._.p5.stroke(255);
        this._.p5.strokeWeight(1);
        this._.p5.noFill();
        this._.p5.beginShape();
        for(let i in this._.ps) {
            let vX = this._.p5.map(i, 0, this._.ps.length, 0, this._.w);
            let vY = this._.ps[i];
            this._.p5.vertex(this._.x + vX, this._.y + this._.h - vY);
        }
        this._.p5.endShape();
    }
}

class GraficoRandom extends Grafico {
    constructor(p5, option) {
        super(p5, option);
    }

    novo() {
        super.novo();
        this._.ps.push(this._.p5.random(this._.h));
    }
}

class GraficoNoise extends Grafico {
    constructor(p5, option) {
        super(p5, option);
        this._.ruido = option.ruido;
        this._.contador = 0;
    }

    novo() {
        super.novo();
        this._.ps.push(this._.p5.noise(this._.contador * this._.ruido) * this._.h);
        this._.contador += 1;
    }
}


class Grafico2d extends Grafico {
    constructor(p5, option) {
        super(p5, option);
        this._.ruido = option.ruido;
        this._.contador = 0;
    }

    desenhar() {
        if (!this._.carregado) {
            this._.p5.loadPixels();
            let d = this._.p5.pixelDensity();
            let w = (this._.w * d);
            let h = (this._.h * d);
            let x = (this._.x * d);
            let y = (this._.y * d);
            let totalW = (this._.p5.width * d);
            let start = (totalW * y) + x;
            for (let i=0;i<h;i++) {
                for(let j=0;j<w;j++) {
                    let x = (i * d);
                    let p = ((i * totalW) + j + start) * 4;
                    let n = this.gerar(i, j);
                    this._.p5.pixels[p] = this._.p5.red(parseInt(255 * n));
                    this._.p5.pixels[p + 1] = this._.p5.green(parseInt(255 * n));
                    this._.p5.pixels[p + 2] = this._.p5.blue(parseInt(255 * n));
                    this._.p5.pixels[p + 3] = this._.p5.alpha(1);
                }
            }
            this._.p5.updatePixels();
            this._.carregado = true;
        }
    }

    gerar(x , y) {
        return 0;
    }

}

class GraficoNoise2d extends Grafico2d {
    constructor(p5, option) {
        super(p5, option);
    }

    gerar(x, y) {
        return this._.p5.noise(x * this._.ruido, y * this._.ruido)
    }

}



class GraficoRandom2d extends Grafico2d {
    constructor(p5, option) {
        super(p5, option);
    }

    gerar() {
        return this._.p5.random();
    }

}

export { GraficoRandom, GraficoNoise, GraficoRandom2d, GraficoNoise2d };