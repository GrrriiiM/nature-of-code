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
        for(let i=0;i<10;i++) bs.push(new Elipse(p5, { h: 50, w: 50 }));
        
        let formas = [
            new Elipse(p5, { x: 50, y: 300, w: 200, h: 200, vX: 0, vMax: 10}),
            new Retangulo(p5, { x: 900, y: 300, w: 100, h: 100, vX: -10, vMax: 30})
            // new Elipse(p5, { x: 600, y: 300, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 644, y: 275, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 644, y: 325, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 688, y: 250, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 688, y: 300, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 688, y: 350, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 732, y: 225, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 732, y: 275, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 732, y: 325, w: 50, h: 50, vX: 0, vMax: 50}),
            // new Elipse(p5, { x: 732, y: 375, w: 50, h: 50, vX: 0, vMax: 50}),
        ];
        

        mundo = new Mundo(p5, { 
            formas: [ 
                ...formas
                //gravidades.criarTerra(p5), 
                //new Retangulo(p5, { h: 200, w: 200, x:p5.height-200 }),
                //...bs 
            ]});
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

