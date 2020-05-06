class Bola {
    constructor(p5, option) {
        
        this.desenhar = () => {
            p5.fill(cor)
            p5.noStroke();
            p5.ellipse(posicao.x, posicao.y, h, w);
        }

        this.mover = () => {
            posicao.add(velocidade);
            if (posicao.x + w/2 > p5.width || posicao.x - w/2 < 0) 
            {
                this.colorirAleatoriamente();
                velocidade.x = velocidade.x * -1;
            }
            if (posicao.y + h/2 > p5.height || posicao.y - h/2 < 0) 
            {
                this.colorirAleatoriamente();
                velocidade.y = velocidade.y * -1;
            }
        }

        this.colorirAleatoriamente = () => {
            cor = p5.color(p5.int(p5.random(256)), p5.int(p5.random(256)), p5.int(p5.random(256)))
        }

        option = option ?? {};
        let h = option.h ?? 50;
        let w = option.w ?? 50;
        let posicao = p5.createVector(option.x ?? h / 2, option.y ?? w / 2);
        let velocidade = p5.createVector(option.vX ?? 5, option.vY ?? 5);
        let cor = {};
        this.colorirAleatoriamente();
    }
}

export { Bola };