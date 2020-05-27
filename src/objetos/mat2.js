export class Mat2 {
    constructor() {
        this.m00 = 0;
        this.m01 = 0;
        this.m10 = 0;
        this.m11 = 0;
        this.set(...arguments);
    }

    set() {
        if (arguments.length == 1) {
            this._set1(arguments[0]);
        } else if (arguments.length == 4) {
            this._set4(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
    }

    _set1(rad) {
        const c = Math.cos(rad );
		const s = Math.sin(rad);

		this.m00 = c;
		this.m01 = -s;
		this.m10 = s;
		this.m11 = c;
    }

    _set4(m00, m01, m10, m11) {
        this.m00 = m00;
        this.m01 = m01;
        this.m10 = m10;
        this.m11 = m11;
    }

    get copia() {
        return new Mat2(this.m00, this.m01, this.m10, this.m11);
    }

    abs() {
        this.m00 = Math.abs(this.m00);
        this.m01 = Math.abs(this.m01);
        this.m10 = Math.abs(this.m10);
        this.m01 = Math.abs(this.m01);
        return this;
    }

    get eixoX() {
        return new Vetor2(this.m00, this.m10);
    }

    get eixoY() {
        return new Vetor2(this.m01, this.m11);
    }

    transp() {
        const a = this.m01;
        this.m01 = this.m10;
        this.m10 = a;
        return this;
    }

    mult(m) {
        this.set(
            this.m00 * m.m00 + this.m01 * m.m10,
			this.m00 * m.m01 + this.m01 * m.m11,
			this.m10 * m.m00 + this.m11 * m.m10,
			this.m10 * m.m01 + this.m11 * m.m11);
    }

}

export class Vetor2 {
    constructor() {
        this.set(...arguments);
    }

    set() {
        if (arguments.length==1){
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        } else {
            this.x = arguments[0] || 0;
            this.y = arguments[1] || 0;
        }
        return this;
    }

    get copia() {
        return new Vetor2(this.x, this.y);
    }

    static neg(v) {
        return v.copia.neg();
    }
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    static adic(v, a) { return v.copia.adic(a); }
    adic(a) {
        if (a instanceof Vetor2) {
            this.x = this.x + a.x;
            this.y = this.y + a.y;
        } else {
            this.x = this.x + a;
            this.y = this.y + a;
        }
        return this;
    }

    static sub(v, a) { return v.copia.sub(a) };
    sub(a) {
        if (a instanceof Vetor2) {
            this.x = this.x - a.x;
            this.y = this.y - a.y;
        } else {
            this.x = this.x - a;
            this.y = this.y - a;
        }
        return this;
    }

    static mult(v, a) { return v.copia.mult(a) };
    mult(a) {
        if (a instanceof Vetor2) {
            this.x = this.x * a.x;
            this.y = this.y * a.y;
        } else if (a instanceof Mat2) {
            let x = a.m00 * this.x + a.m01 * this.y;
            let y = a.m10 * this.x + a.m11 * this.y;
            this.x = x;
		    this.y = y;
        } else {
            this.x = this.x * a;
            this.y = this.y * a;
        }
        return this;
    }

    static div(v, a) { return v.copia.div(a) };
    div(a) {
        if (a instanceof Vetor2) {
            this.x = this.x / a.x;
            this.x = this.y / a.y;
        } else {
            this.x = this.x / a;
            this.y = this.y / a;
        }
        return this;
    }

    get magQ() {
        return this.x*this.x + this.y*this.y;
    }

    get mag() {
        return Math.sqrt(this.magQ);
    }

    static rot(v, a) { return v.copia.rot(a) };
    rot(rad) {
        const c = Math.cos(rad);
		const s = Math.sin(rad);

		const xp = x * c - y * s;
		const yp = x * s + y * c;

		this.x = xp;
        this.y = yp;
        
        return this;
    }

    static rot(v) { return v.copia.norm() };
    norm() {
        this.x = this.x / this.mag;
        this.y = this.y / this.mag;
        return this;
    }

    static escalar(v1, v2) { return v1.copia.escalar(v2) };
    escalar(v) {
        return this.x*v.x + this.y*v.y;
    }

    static max(v1, v2) { return v1.copia.max(v2) };
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }

    static min(v1, v2) { return v1.copia.min(v2) };
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }

    static vetorial(v, s) { return v.copia.vetorial(s) };
    vetorial(s) {
        const a = this.x;
        this.x = this.y * s;
		this.y = a * -s;
		return this;
    }

    static vetorial2(v1, v2) { return v1.copia.vetorial2(v2) };
    vetorial2(v) {
        return this.x * v.y - this.y * v.x;

    }

}

