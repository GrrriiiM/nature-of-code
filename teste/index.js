import { Mundo2, Global, Poligono } from "../objetos/forma.js"
import { Vetor2 } from "../objetos/mat2.js";

new p5((p5) => {

    let mundo = new Mundo2(Global.DT, 10);
    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        let b = mundo.add(new Poligono([[20, -20], [20,20], [-20, 20], [-20, -20]]), 500, 500);
        b.orientacao = Math.random() * 90 * (Math.PI/180);
        b.restituicao = 0.2;
        b.friccaoDinamica = 0.2;
        b.friccaoEstatica = 0.4;

        b = mundo.add(new Poligono([[0, 0], [400,0], [400, 20], [0, 20]]), 600, 600);
        b.estatico();
    }
    
    p5.draw = () => {
        p5.background(0);

        mundo.step();

        for(let corpo of mundo.bodies) {
            p5.stroke("white");
            p5.noFill();
            p5.beginShape();
            for(let vertice of corpo.forma.vertices.map(_ => _.copia)) {
                vertice.mult(corpo.forma.u);
                vertice.adic(corpo.posicao);
                p5.vertex(vertice.x, vertice.y);
            }
            
            p5.endShape(p5.CLOSE);
        }
    }

    p5.mousePressed = () => {
        // let r = parseInt(Math.random()*40 + 10);
        // let vertCount = parseInt(Math.random()*61 + 3);

        // let verts = [];
        // for (let i = 0; i < vertCount; i++) {
        //     verts.push(new Vetor2(parseInt(Math.random()*r*2)-r, parseInt(Math.random()*r*2)-r));
        // }

        // let b = mundo.add( new Poligono(verts), p5.mouseX, p5.mouseY );
        // b.setOrient(parseInt(Math.random()*Math.PI*2) - Math.PI);
        // b.restituicao = 0.2;
        // b.friccaoDinamica = 0.2;
        // b.friccaoEstatica = 0.4;
        let b = mundo.add(new Poligono([[0, 0], [0,20], [0, 40], [-20, 40], [-40, 40], [-40, 20], [-40, 0]]), p5.mouseX, p5.mouseY);
        b.orientacao = Math.random() * 90 * (Math.PI/180);
    }

});




