
new p5((p5) => {

    let cores = [
        "blue",
        "red",
        "green"
    ];
    let centro;
    let vetores = [];

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        centro = Vetor2d.criarPos(Math.round(p5.width/20), Math.round(p5.height/20));
    }
    
    p5.draw = () => {
        p5.background("black");

        p5.stroke("white");
        p5.strokeWeight(0.5);
        p5.line(0,centro.y*10, p5.width, centro.y*10);
        p5.line(centro.x*10, 0, centro.x*10, p5.height);

        for(let i=0;i<vetores.length;i++) {
            let v = vetores[i];
            p5.stroke(cores[i%3]);
            p5.strokeWeight(1);
            p5.line(centro.x*10, centro.y*10, (v.x + centro.x)*10, (v.y + centro.y)*10);
            p5.fill(cores[i%3]);
            p5.text(`V${i}: [ ${v.x} ${v.y} ]`, 20, 20 * (i + 1));
        }

        if (vetores.length >= 3) {
            let p = Poligono.criar(vetores);
            p5.beginShape();
            p5.fill(255,255,255,255*0.2);
            for(let vertice of p.vs.map(_ => _.adic(centro).mult(10))) {
                p5.vertex(vertice.x, vertice.y);
            }
            p5.endShape(p5.CLOSE);
        }

        if (p5.mouseIsPressed) {
            let v = Vetor2d.criarPos(Math.round(p5.mouseX/10), Math.round(p5.mouseY/10))
            v = v.sub(centro);
            p5.stroke("white");
            p5.strokeWeight(0.2);
            p5.line(centro.x*10, centro.y*10, (v.x + centro.x)*10, (v.y + centro.y)*10);
            p5.fill("white");
            let t = v.adic(v.norm());
            let a= 0;
            let v1 = Vetor2d.criarPos(1,0);
            if (vetores.length) {
                v1 = vetores[vetores.length-1];    
            } 
            a = v1.angG(v);
            p5.text(`[ ${v.x} ${v.y} ] a: ${a}`, (t.x + centro.x)*10, (t.y + centro.y)*10);
        }
    }

    p5.mouseReleased = () => {
        let v = Vetor2d.criarPos(parseInt(p5.mouseX/10), parseInt(p5.mouseY/10));
        v = v.sub(centro);
        vetores.push(Vetor2d.criarPos(v.x, v.y));
        
    }

});


class Vetor2d {
    static criarPos(x, y) {
        let v = new Vetor2d();
        v.x = x;
        v.y = y;
        return v;
    }

    static criarAng(angulo, magnitude) {
        let v = new Vetor2d();
        let s = Math.sin(angulo);
        let c = Math.cos(angulo);
        let x = c * magnitude;
        let y = s * magnitude;
        return this.criarPos(x, y);
    }

    static criarVec(v) {
        let v1 = new Vetor2d();
        v1.x = v.x;
        v1.y = v.y;
        return v1;
    }

    //sin = oposto / hipotenusa
    //cos = adjacente / hipotenusa
    //toa = oposto / adjacente
    //sohcahtoa

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    static magQ(v) { return Math.pow(v.x, 2) + Math.pow(v.y, 2); }
    get magQ() { return Vetor2d.magQ(this); }

    static mag(v) { return Math.sqrt(this.magQ(v)); }
    get mag() { return Vetor2d.mag(this); }

    static copia(v) { return this.criarVec(v); }
    get copia() { return Vetor2d.copia(this); }

    static norm(v, n) {
        n = n || 1;
        let m = v.mag;
        return this.criarPos(v.x/m, v.y/m).mult(n);
    }
    norm(n) { return Vetor2d.norm(this, n); }

    static adic(v1, v2) {
        let v = v1.copia;
        v.x += v2.x;
        v.y += v2.y;
        return v;
    }
    adic(v) { return Vetor2d.adic(this, v); }


    static mult(v1, n) {
        let v = v1.copia;
        v.x *= n;
        v.y *= n;
        return v;
    }
    mult(n) { return Vetor2d.mult(this, n); }

    static sub(v1, v2) {
        let v = v1.copia;
        v.x -= v2.x;
        v.y -= v2.y;
        return v;
    }
    sub(v) { return Vetor2d.sub(this, v); }

    static pEsc(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y;
    }
    pEsc(v) { return Vetor2d.pEsc(this, v); }

    static cos(v1, v2) {
        return this.pEsc(v1, v2) / (v1.mag * v2.mag);
    }
    cos(v) { return Vetor2d.cos(this, v); }

    static angR(v1, v2) {
        let a = Math.acos(this.cos(v1, v2));
        a = v1.pVet(v2) < 0 ? (Math.PI*2) - a  : a;
        
        return  a;
    }
    angR(v) { return Vetor2d.angR(this, v); }

    static angG(v1, v2) {
        return this.angR(v1, v2) * (180/Math.PI);
    }
    angG(v) { return Vetor2d.angG(this, v); }

    static inv(v) {
        let v1 = v.copia;
        v1.x *= -1;
        v1.y *= -1;
        return v1;
    }
    get inv() { return Vetor2d.inv(this); }

    static rotR(v, r) {
        let c = Math.cos(r);
        let s = Math.sin(r);
        let v1 = v.copia;
        v1.x = v.x*c - v.y*s;
        v1.y = v.x*s + v.y*c;
        return v1
    }
    rotR(r) {
        return Vetor2d.rotR(this, r);
    }

    static rotG(v, g) {
        let r = g / (180/Math.PI);
        return this.rotR(v, r);
    }
    rotG(g) { return Vetor2d.rotG(this, g); }

    static pVet(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }
    pVet(v) { return Vetor2d.pVet(this, v); }

    static pVet2(v1, n) {
        return this.criarVec(v1.y * n, - v1.x * -n);
    }
    pVet2(n) { return Vetor2d.pVet2(this, n); }
}

class Matriz2d {

	static criarAng(a) {
        let r = a / (Math.PI/180);
		const c = Math.cos(r);
        const s = Math.sin(r);
        return this.criarPos(c, -s, s, c)
    }
    
    static criarPos(m00, m01, m10, m11) {
        let m2 = new Matriz2d();

		m2.m00 = m00;
		m2.m01 = m01;
		m2.m10 = m10;
		m2.m11 = m11;
    }

    constructor() {
        this.m00 = 0;
        this.m01 = 0;
        this.m10 = 0;
        this.m11 = 0;
    }

    get copia() {
        return Matriz2d(this.m00, this.m01, this.m10, this.m11);
    }

    static abs(m) {
        let m1 = m.copia;
        m1.m00 = Math.abs(m.m00);
        m1.m01 = Math.abs(m.m01);
        m1.m10 = Math.abs(m.m10);
        m1.m01 = Math.abs(m.m01);
        return m;
    }
    abs() { return Matriz2d.abs(this); }

    get eixoX() {
        return new Vetor2(this.m00, this.m10);
    }

    get eixoY() {
        return new Vetor2(this.m01, this.m11);
    }

    static transp(m) {
        let m1 = m.copia;
        m1.m01 = m.m10;
        m1.m10 = m.m01;
        return m1;
    }
    transp() { return Matriz2d.transp(this); }

    static mult(m1, m2) {
        let m = m1.copia;
        m.m00 = m1.m00 * m2.m00 + m1.m01 * m2.m10,
        m.m01 = m1.m00 * m2.m01 + m1.m01 * m2.m11,
        m.m10 = m1.m10 * m2.m00 + m1.m11 * m2.m10,
        m.m11 = m1.m10 * m2.m01 + m1.m11 * m2.m11;
    }
    mult(m) { return Matriz2d.mult(this, m); }
}

class Forma {
    static criarPoligono(vertices) {
        return Poligono.criar(vertices);
    }
}

class Poligono extends Forma {

    static criar(vertices) {
        let p = new Poligono();
        p.montar(vertices.map(_ => {
            if (_ instanceof Vetor2d) return _;
            else if(_ instanceof Array) return Vetor2d.criarPos(_[0], _[1]);
        }));
        return p;
    }

    constructor() {
        super();
        this.vs = [];
        this.ns = [];
        this.area;
    }

    montar(vertices) {
        let verticeDireita = vertices.reduce((p,c) => {
            if (!p || c.x > p.x) return c;
            else if (c.x == p.x && c.y < c.y) return c;
            return p;
        });

        
        let ordernados = [ verticeDireita ];
        let linhaBase = Vetor2d.criarAng(0, 1).norm();
        
        
        while(true) {
            let melhorVertice;
            let verticeBase = ordernados.length ? ordernados[ordernados.length-1] : linhaBase;
            
            for(let vertice of vertices) {
                if (vertice == verticeBase) continue;
                if (!melhorVertice ) { melhorVertice = vertice; continue }
                let v1 = melhorVertice.sub(verticeBase);
                let v2 = vertice.sub(verticeBase);
                let pVet = v1.pVet(v2);
                if (pVet<0 || (pVet==0 && v2.magQ > v2.magQ)) {
                    melhorVertice = vertice;
                }
            }
            if (melhorVertice == verticeDireita) break;
            ordernados.push(melhorVertice);
        }

        this.vs = ordernados;
        this.ns = [];

        for(let i=0; i<this.vsQtd; i++) {
            let v1 = this.vs[i==0 ? this.vsQtd-1 : i-1];
            let v2 = this.vs[i]
            this.ns.push(v1.sub(v2));
        }
        this.area = Vetor2d.criarPos(Math.max(...this.vs.map(_ => _.x)), Math.max(...this.vs.map(_ => _.y)));
    }

    get vsQtd() {
        return this.vs.length;
    }
}




