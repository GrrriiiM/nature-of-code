class GraficoRandom {
    constructor(p5, option) {
        option = option || {};
        let h = option.h || 50;
        let w = option.w || 50;
        let x = option.x || 0;
        let y = option.y || 0;
        let maxP = option.maxP || 50;

        let ps = [];

        this.novo = () => {
            if (ps.length<=maxP) ps.push(p5.random(h));
        };

        this.desenhar = () => {
            let max = ps.reduce((p, c) => p > c ? p : c, 0);
            let min = ps.reduce((p, c) => p < c ? p : c, h);
            p5.stroke(255);
            p5.strokeWeight(1);
            p5.noFill();
            p5.beginShape();
            for(let i in ps) {
                let vX = p5.map(i, 0, ps.length, 0, w);
                let vY = p5.map(ps[i], min, max, 0, h);
                p5.vertex(x + vX, y + h - vY);
            }
            p5.endShape();
        };
    }
}

class GraficoNoise {
    constructor(p5, option) {
        option = option || {};
        let h = option.h || 50;
        let w = option.w || 50;
        let x = option.x || 0;
        let y = option.y || 0;
        let maxP = option.maxP || 50;
        let ruido = option.ruido || 0.1;

        let ps = [];

        this.novo = () => {
            if (ps.length<=maxP) ps.push(p5.noise(ps.length*ruido) * h);
        };

        this.desenhar = () => {
            let max = ps.reduce((p, c) => p > c ? p : c, 0);
            let min = ps.reduce((p, c) => p < c ? p : c, h);
            p5.stroke(255);
            p5.strokeWeight(1);
            p5.noFill();
            p5.beginShape();
            for(let i in ps) {
                let vX = p5.map(i, 0, ps.length, 0, w);
                let vY = p5.map(ps[i], min, max, 0, h);
                p5.vertex(x + vX, y + h - vY);
            }
            p5.endShape();
        };
    }
}

export { GraficoRandom, GraficoNoise };