export class Forca {
    static G = 6.67428 * Math.pow(10, -10);// * Math.pow(10, -11);
    static gravidade(p, m1, m2, x1, x2, y1, y2) {
        let v1 = p.createVector(x1, y1);
        let v2 = p.createVector(x2, y2);
        v2.sub(v1);
        let d = v2.mag();
        let m = (this.G * m1 * m2) / (d * d);
        v2.normalize();
        v2.mult(m);
        return v2;
    }

    static atrito() {

    }

    static colisao(m1, m2, v1, v2) {
        let v = ((m1 - m2) / (m1 + m2)) * v1;
        v += ((2*m2) / (m1 + m2)) * v2;
        return v;
    }
}

