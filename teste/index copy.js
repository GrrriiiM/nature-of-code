new p5((p5) => {

    let po1;
    let po2;
    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        po1 = new Poligono(p5,[100, 100], [[-25, -25], [25, 25], [-25, 25]]);
        po2 = new Poligono(p5,[500, 500], [[0, -50], [50, 0], [25, 50], [-25, 50], [-50, 0]]);
        //po2 = new Poligono(p5, [[100, 100], [150,50], [200, 100], [175, 150], [125, 150]]);
        //po2.setPosicao([400, 500])
    }
    
    p5.draw = () => {
        let move = p5.createVector(p5.mouseX, p5.mouseY);
        let dif = po1.posicao.copy().sub(move);
        po1.setPosicao([ move.x, move.y])
        p5.background(0);
        if (sat(po1, po2)) {
            po2.hit = true;
            let nPosicao = po2.posicao.copy().sub(dif);
            po2.setPosicao([ nPosicao.x, nPosicao.y ])
        } else {
            po2.hit = false;
        }
        po1.desenhar();
        po2.desenhar();
    }

});


class Poligono {
    constructor(p5, posicao, pontos) {
        this.p5 = p5;
        this.pontos = pontos.map(_ => this.p5.createVector(_[0], _[1]));
        this.arestas = this.pontos.map((_, i) => this.pontos[i + 1 == this.pontos.length ? 0 : i + 1].copy().sub(_));
        this.normas = this.arestas.map(_ => this.p5.createVector(-_.y, _.x).normalize());
        let minW = Math.min(...pontos.map(_ => _[0]));
        let maxW = Math.max(...pontos.map(_ => _[0]));
        let minH = Math.min(...pontos.map(_ => _[1]));
        let maxH = Math.max(...pontos.map(_ => _[1]));
        this.width = maxW - minW;
        this.height = maxH - minH;
        this.tamanho = this.p5.createVector(this.width, this.height);
        this.setPosicao(posicao);
    }

    setPosicao(posicao) {
        this.posicao = this.p5.createVector(posicao[0], posicao[1]);
        this.vertices = this.pontos.map(_ => _.copy().add(this.posicao));
    }

    desenhar() {
        this.p5.noStroke();
        if (this.hit) this.p5.fill(255);
        else this.p5.fill("green");
        this.p5.beginShape();

        for(var vertice of this.vertices) {
            this.p5.vertex(vertice.x, vertice.y);
        }

        this.p5.endShape(this.p5.CLOSE);
        this.p5.noFill();
        this.p5.strokeWeight(1);
        this.p5.stroke("red");
        this.p5.rect(this.posicao.x - this.tamanho.x/2, this.posicao.y - this.tamanho.y/2, this.tamanho.x, this.tamanho.y);
        this.p5.strokeWeight(5);
        this.p5.point(this.posicao);

        this.p5.strokeWeight(1);
        for(let i in this.normas) {
            let aresta = this.arestas[i].copy().div(2);
            let vertice = this.vertices[i].copy().add(aresta);
            let norma = this.normas[i].copy().mult(-1).add(vertice);
            this.p5.line(vertice.x, vertice.y, norma.x, norma.y);
        }
    }
}


function sat(formaA, formaB){
    var amin = null;
    var amax = null;
    var bmin = null;
    var bmax = null;
    let normas = [...formaA.normas, ...formaB.normas];
    for(let norma of normas){
         amin = null;
         amax = null;
         bmin = null;
         bmax = null;
         for(let vertice of formaA.vertices){
              let dot = vertice.dot(norma)
              if(amax === null || dot > amax){
                   amax = dot;
              }
              if(amin === null || dot < amin){
                   amin = dot;
              }
         }
         for(let vertice of formaB.vertices){
              let dot = vertice.dot(norma);
              if(bmax === null || dot > bmax){
                   bmax = dot;
              }
              if(bmin === null || dot < bmin){
                   bmin = dot;
              }
         }
         if((amin < bmax && amin > bmin) ||
            (bmin < amax && bmin > amin)){
              continue;
         }
         else {
              return false;
         }
    }
    return true;
}


// class SAT {
//     static project(vec1, vec2) {
//         let a = vec1.dot(vec2) / vec2.magSq();
//         return p5.createVector(vec2.copy().mult(a))
//     }

//     static projectN(vec1, vec2) {
//         let a = vec1.dot(vec2);
//         return p5.createVector(vec2.copy().mult(a))
//     }

//     static sat(polygonA, polygonB){
//         var perpendicularLine = null;
//         var dot = 0;
//         var perpendicularStack = [];
//         var amin = null;
//         var amax = null;
//         var bmin = null;
//         var bmax = null;
//         for(var i = 0; i < polygonA.edge.length; i++){
//              perpendicularLine = new xy(-polygonA.edge[i].y,
//                                          polygonA.edge[i].x);
//              perpendicularStack.push(perpendicularLine);
//         }
//         for(var i = 0; i < polygonB.edge.length; i++){
//              perpendicularLine = new xy(-polygonB.edge[i].y,
//                                          polygonB.edge[i].x);
//              perpendicularStack(perpendicularLine);
//         }
//         for(var i = 0; i < perpendicularStack.length; i++){
//              amin = null;
//              amax = null;
//              bmin = null;
//              bmax = null;
//              for(var j = 0; j < polygonA.vertex.length; j++){
//                   dot = polygonA.vertex[j].x *
//                         perpenddicularStack[i].x +
//                         polygonA.vertex[j].y *
//                         perpendicularStack[i].y;
//                   if(amax === null || dot < amin){
//                        amax = dot;
//                   }
//                   if(amin === null || dot < amin){
//                        amin = dot;
//                   }
//              }
//              for(var j = 0; j < polygonB.vertex.length; j++){
//                   dot = polygonB.vertex[j].x *
//                         perpendicularStack[i].x +
//                         polygonB.vertex[j].y *
//                         perpendicularStack[i].y;
//                   if(bmax === null || dot > bmax){
//                        bmax = dot;
//                   }
//                   if(bmin === null || dot < bmin){
//                        bmin = dot;
//                   }
//              }
//              if((amin < bmax && amin > bmin) ||
//                 (bmin < amax && bmin > amin)){
//                   continue;
//              }
//              else {
//                   return false;
//              }
//         }
//         return true;
//    }
   
// }
