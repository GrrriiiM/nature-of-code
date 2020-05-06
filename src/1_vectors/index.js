import { Bola } from "./bola.js";

new p5((p5) => {
    let bola1 = new Bola(p5);

    p5.setup = () => {
        p5.createCanvas(800, 600);
    }
    
    p5.draw = () => {
        p5.background(0);

        bola1.mover();
        bola1.desenhar();
    }

});

