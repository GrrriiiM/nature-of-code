import { GraficoRandom, GraficoNoise, GraficoNoise2d } from "./graficos.js"

new p5((p5) => {
    let graficoRandom;
    let graficoNoise;
    let graficoNoise2d
    let ruido = 0.01;

    p5.setup = () => {
        p5.createCanvas(800, 600);
        
        graficoRandom = new GraficoRandom(p5, { h: 160, w: p5.width, y:40, maxP: 300 });
        graficoNoise = new GraficoNoise(p5, { h: 160, w: p5.width, y: 240, maxP: 300, ruido: ruido });
        graficoNoise2d = new GraficoNoise2d(p5, { h: 160, w: p5.width, y: 440, maxP: 300, ruido: ruido });
    }
    
    p5.draw = () => {
        p5.background(0);

        p5.textSize(30);
        p5.fill(255);
        p5.text("Aleatorio (Random)", 10, 35);
        graficoRandom.novo();
        graficoRandom.desenhar();

        p5.fill(255);
        p5.text(`Ruido (Perlin Noise) ${ruido}`, 10, 235);
        graficoNoise.novo();
        graficoNoise.desenhar();

        graficoNoise2d.novo();
        graficoNoise2d.desenhar();
    }

});

