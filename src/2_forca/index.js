import {  Forma, Elipse, Retangulo } from "../objetos/formas.js"
import { Gravidade } from "../objetos/forcas.js"

new p5((p5) => {
    let bs = [];
    let g;
    let wind;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        for(let i=0;i<5;i++) bs.push(new Elipse(p5));
        g = new Gravidade(p5, { x:0, y: 0, w: p5.width, h: p5.height });
        wind = p5.createVector(0.1, 0);
    }
    
    p5.draw = () => {
        p5.background(0);
        g.desenhar();
        bs.forEach(_ => {
            g.aplicar(_);
            //_.aplicarForca(wind.copy());
            _.desenhar();
        })
        
    }

    p5.mouseReleased = () => {
        bs.forEach(_ => {
            let v = p5.createVector(p5.mouseX, p5.mouseY);
            v.sub(p5.createVector(_.x, _.y));
            v.normalize()
            _.aplicarForca(v.mult(10))
        })
    }

});

