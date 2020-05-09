import { Bola } from "./bola.js";

new p5((p5) => {
    let ruidoCor = 0.001;
    let bolas = [];
    

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        for(let i=0;i<200;i++) {
            bolas.push(new Bola(p5, {
                n: i
            }));
        }
    }
    
    p5.draw = () => {
        //p5.background(0);
        bolas.forEach(_ => {
            _.mover();
            _.desenhar();
            _.colorirAleatoriamente();
        })
        
    }

});

