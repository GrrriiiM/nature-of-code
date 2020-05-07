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

class GraficoNoise2d extends Grafico {
    constructor(p5, option) {
        super(p5, option);
        this._.ruido = option.ruido;
        this._.contador = 0;
    }

    // novo() {
    //     var psX = [];
    //     let d = pixelDensity();
    //     for(let i = 0; i<this._.h*d; i++)
    //     {
    //         psX.push(this._.p5.noise(this._.contador * this._.ruido, i * ruido) * this._.h);
    //     }
    //     this._.contador += 1;
    //     this._.ps.push(psx);
    // }

    desenhar() {
        this._.p5.loadPixels();
        let d = this._.p5.pixelDensity();
        let w = (this._.w * d);
        let h = (this._.h * d);
        let y = (this._.y * d);
        let size = w * h;
        let start = w * y;
        for (let i = 0; i<size; i++) {
            let a = (start + i) * 4;
            
            let x = Math.floor(i / w);
            let y = i - (x * w);
            if (x == 1) {
                var xxx = "";
            }
            let n = this._.p5.noise(x * this._.ruido, y * this._.ruido)
            this._.p5.pixels[a] = this._.p5.red(parseInt(255 * n));
            this._.p5.pixels[a + 1] = this._.p5.green(parseInt(255 * n));
            this._.p5.pixels[a + 2] = this._.p5.blue(parseInt(255 * n));
            this._.p5.pixels[a + 3] = this._.p5.alpha(1);
        }
        this._.p5.updatePixels();
    }

}

export { GraficoRandom, GraficoNoise, GraficoNoise2d };