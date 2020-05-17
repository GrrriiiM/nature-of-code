import {  Forma, Elipse, Retangulo } from "../objetos/formas.js"
import { Mundo } from "../objetos/mundo.js";
import gravidades from "../objetos/gravidades.js";

new p5((p5) => {
    let bs = [];
    let g;
    let wind;
    let earth;
    let mundo;
    let b;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        for(let i=0;i<10;i++) bs.push(new Elipse(p5));
        
        mundo = new Mundo(p5, { 
            formas: [ 
                gravidades.criarTerra(p5), 
                new Elipse(p5, { h: 400, w: 400 }),
                ...bs ]});
    }
    
    p5.draw = () => {
        p5.background(0);
        //bs.forEach(_ => _.aplicarForca(p5.createVector(100, 0)))
        mundo.atualizar();
        mundo.desenhar();
    }

    // p5.mouseReleased = () => {
    //     bs.forEach(_ => {
    //         let v = p5.createVector(p5.mouseX, p5.mouseY);
    //         v.sub(p5.createVector(_.x, _.y));
    //         v.normalize()
    //         _.aplicarForca(v.mult(10))
    //     })
    // }

});

