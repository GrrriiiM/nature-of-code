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


    
    static colisao(m1, m2, x1, x2, y1, y2, v1, v2, a1, a2) {

        let phi = Math.atan2(y2 - y1, x2 - x1);
        let phi1 = a1 - phi;
        let phi2 = a2 - phi;

        let x = (v1 * Math.cos(phi1) * (m1-m2) + 2*m2*v2*Math.cos(phi2)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(phi1) * Math.cos(phi+Math.PI/2);
        let y = (v1 * Math.cos(phi1) * (m1-m2) + 2*m2*v2*Math.cos(phi2)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(phi1) * Math.sin(phi+Math.PI/2);

        // let dx2F = (v2 * Math.cos(phi2) * (m2-m1) + 2*m1*v1*Math.cos(phi1)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(phi2) * Math.cos(phi+Math.PI/2);
        // let dy2F = (v2 * Math.cos(phi2) * (m2-m1) + 2*m1*v1*Math.cos(phi1)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(phi2) * Math.sin(phi+Math.PI/2);
        
        return { x: x, y: y }; 
 
    }
}

