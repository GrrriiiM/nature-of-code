import {  Forma, Elipse, Retangulo } from "../objetos/formas.js"
import { GravidadeArea } from "../objetos/forcas.js"
import { Mundo } from "../objetos/mundo.js";

new p5((p5) => {
    let bs = [];
    let g;
    let wind;
    let earth;
    let mundo;
    let b;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        for(let i=0;i<5;i++) bs.push(new Elipse(p5));
        // g = new GravidadeArea(p5, { x:0, y: 0, w: p5.width, h: p5.height });
        // wind = p5.createVector(0.1, 0);
        let s = 1000000000000;
        earth = new Elipse(p5, { h: s, w: s, x: p5.width/2 - s/2, y: p5.height-10 })
        b = new Elipse(p5);
        mundo = new Mundo(p5, { formas: [ earth, ...bs ]});
    }
    
    p5.draw = () => {
        p5.background(0);
        bs.forEach(_ => _.aplicarForca(p5.createVector(1000, 0)));
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

