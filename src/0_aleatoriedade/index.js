import { GraficoRandom, GraficoNoise, GraficoRandom2d, GraficoNoise2d } from "./graficos.js"

new p5((p5) => {
    let graficoRandom;
    let graficoNoise;
    let graficoRandom2d;
    let graficoNoise2d
    let ruido = 0.01;

    p5.setup = () => {
        p5.createCanvas(800, 600);
        
        graficoRandom = new GraficoRandom(p5, { h: 160, w: p5.width, y:40, maxP: 300 });
        graficoNoise = new GraficoNoise(p5, { h: 160, w: p5.width, y: 240, maxP: 300, ruido: ruido });
        graficoRandom2d = new GraficoRandom2d(p5, { h: 160, w: p5.width/2, y: 440, maxP: 300 });
        graficoNoise2d = new GraficoNoise2d(p5, { h: 160, w: p5.width/2, x: p5.width/2, y: 440, maxP: 300, ruido: ruido });
        p5.background(0);
        p5.textSize(30);
        p5.fill(255);
        p5.text("Aleatorio (Random)", 10, 35);
        p5.text(`Ruido (Perlin Noise) ${ruido}`, 10, 235);
        p5.text(`Aleatório 2D`, 10, 435);
        p5.text(`Ruido 2D ${ruido}`, (p5.width/2) + 10, 435);
        
    }
    
    p5.draw = () => {

        
        graficoRandom.novo();
        graficoRandom.desenhar();

        graficoNoise.novo();
        graficoNoise.desenhar();

        graficoRandom2d.novo();
        graficoRandom2d.desenhar();

        graficoNoise2d.novo();
        graficoNoise2d.desenhar();
    }

});

