import { Vetor2, Mat2 } from "./mat2.js";

export class Corpo {
    constructor(forma, x, y) {
        this.forma = forma;
        this.posicao = new Vetor2(x, y);
        this.velocidade = new Vetor2();
        this.velocidadeAngular = 0;
        this.torque = 0;
        
        this.forca = new Vetor2;
        this.friccaoEstatica = 0.5;
        this.friccaoDinamica = 0.3;
        this.restituicao = 0.2;
        this.massa = 0;
        this.massaInv = 0;
        this.inercia = 0;
        this.inerciaInv = 0;

		this.forma.corpo = this;
		this.orientacao = 0;
        this.forma.iniciar();
    }

    aplicarForca(f) {
        this.forca.adic(f);
    }

    aplicarImpulso(impulso, contato) {
        this.velocidade.adic(Vetor2.mult(impulso, this.massaInv));
        this.velocidadeAngular += this.inerciaInv * Vetor2.vetorial2(contato, impulso);
    }

    estatico() {
        this.inercia = 0;
        this.inerciaInv = 0;
        this.massa = 0;
        this.massaInv = 0;
    }

    set orientacao(rad) {
        this._orientacao = rad;
        this.forma.orientar(rad);
	}
	
	get orientacao() {
        return this._orientacao
    }
}

class Forma {
    constructor() {
        this.u = new Mat2()
    }
}

export class Poligono extends Forma {
    constructor(vertices) {
        super();
        this.vertices = [];
        this.normals = [];
		this.vertexCount = 0;
		if (vertices[0] instanceof Array) {
        	this.set(vertices.map(_ => new Vetor2(_[0], _[1])));
		} else {
			this.set(vertices);
		}
	}
	iniciar() {
		this.calcularMassa(1);
	}

	calcularMassa(densidade) {
		let c = new Vetor2(0, 0);
		let area = 0;
		let I = 0;
		let k_inv3 = 1/3;

		for (let i = 0; i < this.vertexCount; ++i) {
			let p1 = this.vertices[i].copia;
			let p2 = this.vertices[(i + 1) % this.vertexCount].copia;

			let D = Vetor2.vetorial2(p1, p2);
			let triangleArea = 0.5*D;

			area += triangleArea;

			let weight = triangleArea * k_inv3;
			c.adic(p1.copia.mult(weight));
			c.adic(p2.copia.mult(weight));

			let intx2 = p1.x * p1.x + p2.x * p1.x + p2.x * p2.x;
			let inty2 = p1.y * p1.y + p2.y * p1.y + p2.y * p2.y;
			I += (0.25 * k_inv3 * D) * (intx2 + inty2);
		}

		c.mult(1.0/area);

		for (let i = 0; i < this.vertexCount; ++i) {
			this.vertices[i].sub(c);
		}

		this.corpo.massa = densidade * area;
		this.corpo.massaInv = (this.corpo.massa != 0.0) ? 1/this.corpo.massa : 0;
		this.corpo.inercia = I * densidade;
		this.corpo.inerciaInv = (this.corpo.inercia != 0) ? 1/this.corpo.inercia : 0;
	}

	
	orientar(rad) {
		this.u.set(rad);
	}

    set(vertices) {
        let rightMost = 0;
        let highestXCoord = vertices[0].x;

        for (let i=1; i < vertices.length; ++i) {
            let x = vertices[i].x;

            if (x > highestXCoord) {
                highestXCoord = x;
                rightMost = i;
            } else if (x == highestXCoord) {
                if (vertices[i].y < vertices[rightMost].y) {
                    rightMost = i;
                }
            }
        }

        let hull = [];
        let outCount = 0;
        let indexHull = rightMost;

        for(;;) {
            hull[outCount] = indexHull;

            let nextHullIndex = 0;
            for (let i=0; i<vertices.length; ++i) {
                if (nextHullIndex == indexHull) {
                    nextHullIndex = i;
                    continue;
                }

                let e1 = vertices[nextHullIndex].copia.sub(vertices[hull[outCount]]);
                let e2 = vertices[i].copia.sub(vertices[hull[outCount]]);
                let c = Vetor2.vetorial(e1,e2);
                if (c < 0) {
                    nextHullIndex = i;
                }

                if (c == 0 && e2.magQ > e1.magQ) {
                    nextHullIndex = i;
                }
            }

            ++outCount;
            indexHull = nextHullIndex;

            if (nextHullIndex == rightMost) {
                this.vertexCount = outCount;
                break;
            }
        }

        for (let i = 0; i < this.vertexCount; ++i) {
            this.vertices.push(vertices[hull[i]].copia);
        }

		//this.vertices = vertices;
		//this.vertexCount = this.vertices.length;
        for (let i=0; i<this.vertexCount; ++i) {
            let face = this.vertices[(i + 1) % this.vertexCount].copia.sub(this.vertices[i]);

            this.normals.push(new Vetor2(face.y, -face.x).norm());
        }
    }

    suporte(dir) {
		let bestProjection = -Number.MAX_VALUE;
		let bestVertex = null;

		for (let i=0; i<this.vertexCount; ++i)
		{
			let v = this.vertices[i];
			let projection = Vetor2.escalar(v, dir);

			if (projection > bestProjection)
			{
				bestVertex = v;
				bestProjection = projection;
			}
		}

		return bestVertex;
	}
}


export class Manifold {
	constructor(corpo1, corpo2)
	{
		this.A = corpo1;
	    this.B = corpo2;
	    this.penetration = 0;
	    this.normal = new Vetor2();
	    this.contacts = [ new Vetor2(), new Vetor2() ];
	    this.contactCount = 0;
	    this.e = 0;
	    this.df = 0;
        this.sf = 0;
        this.collision = new CollisionPolygonPolygon();
	}

	solve() {
		this.collision.handleCollision( this, this.A, this.B );
	}

	initialize() {

		this.e = Math.min(this.A.restituicao, this.B.restituicao);

        this.sf = Math.sqrt(this.A.friccaoEstatica*this.A.friccaoEstatica + this.B.friccaoEstatica*this.B.friccaoEstatica);
        this.df = Math.sqrt(this.A.friccaoDinamica * this.A.friccaoDinamica + this.B.friccaoDinamica * this.B.friccaoDinamica);

		for (let i=0; i < this.contactCount; ++i) {
			let ra = this.contacts[i].copia.sub(this.A.posicao);
			let rb = this.contacts[i].copia.sub(this.B.posicao);

			let vv = Vetor2.vetorial(rb, -this.B.velocidadeAngular);
			let rv = this.B.velocidade.copia
			rv.adic(vv);
            rv.sub(this.A.velocidade)
            rv.sub(Vetor2.vetorial(ra, -this.A.velocidadeAngular));

            if (rv.magQ < Global.RESTING)
            {
            	this.e = 0;
            }
		}
	}

	applyImpulse() {

		if (this.A.massaInv + this.B.massaInv == 0) {
			this.infiniteMassCorrection();
			return;
		}

		for (let i=0; i < this.contactCount; ++i) {
			let ra = this.contacts[i].copia.sub(this.A.posicao);
			let rb = this.contacts[i].copia.sub(this.B.posicao);

            let rv = this.B.velocidade.copia
                .adic(Vetor2.vetorial(rb, -this.B.velocidadeAngular))
                .sub(this.A.velocidade)
                .sub(Vetor2.vetorial(ra, -this.A.velocidadeAngular));

			let contactVel = Vetor2.escalar(rv, this.normal);

			if (contactVel > 0)
			{
				return;
			}
			let raCrossN = Vetor2.vetorial2(ra, this.normal);
			let rbCrossN = Vetor2.vetorial2(rb, this.normal);
			let invMassSum = this.A.massaInv + this.B.massaInv + (raCrossN * raCrossN) * this.A.inerciaInv + (rbCrossN * rbCrossN) * this.B.inerciaInv;

			// Calculate impulse scalar
			let j = -(1 + this.e) * contactVel;
			j /= invMassSum;
			j /= this.contactCount;

			// Apply impulse
			let impulse = this.normal.copia.mult(j);
			this.A.aplicarImpulso(impulse.copia.neg(), ra );
			this.B.aplicarImpulso(impulse, rb );

			// Friction impulse
			// rv = B->velocity + Cross( B->angularVelocity, rb ) -
			// A->velocity - Cross( A->angularVelocity, ra );
            rv = this.B.velocidade.copia
                .adic(Vetor2.vetorial(rb, -this.B.velocidadeAngular))
                .sub(this.A.velocidade)
                .sub(Vetor2.vetorial(ra, -this.A.velocidadeAngular));

			// Vec2 t = rv - (normal * Dot( rv, normal ));
			// t.Normalize( );
            let t = rv.copia
                .adic(Vetor2.mult(this.normal, -Vetor2.escalar(rv, this.normal)))
			    .norm();

			// j tangent magnitude
			let jt = -Vetor2.escalar(rv, t);
			jt /= invMassSum;
			jt /= this.contactCount;

			// Don't apply tiny friction impulses
			if (jt == 0) {
				return;
			}

            let tangentImpulse;
            
			if (Math.abs(jt) < j * this.sf) {
				tangentImpulse = t.copia.mult(jt);
			} else {
				tangentImpulse = t.copia.mult(j).mult(-this.df);
			}

			this.A.aplicarImpulso(tangentImpulse.copia.neg(), ra);
			this.B.aplicarImpulso(tangentImpulse, rb);
		}
	}

	positionalCorrection() {
        const PENETRATION_ALLOWANCE = 0.05;
        const PENETRATION_CORRETION = 0.4
		let correction = Math.max(this.penetration - PENETRATION_ALLOWANCE, 0) / (this.A.massaInv + this.B.massaInv) * PENETRATION_CORRETION;

		this.A.posicao.adic(this.normal.copia.mult(-this.A.massaInv * correction));
		this.B.posicao.adic(this.normal.copia.mult(this.B.massaInv * correction));
	}

	infiniteMassCorrection()
	{
		this.A.velocidade.set(0, 0);
		this.B.velocidade.set(0, 0);
	}

}

class CollisionPolygonPolygon {

	
	handleCollision(m, a, b)
	{
		let A = a.forma;
		let B = b.forma;
		m.contactCount = 0;

		// Check for a separating axis with A's face planes
		let faceA = [0];
		let penetrationA = this.findAxisLeastPenetration(faceA, A, B );
		if (penetrationA >= 0) {
			return;
		}

		// Check for a separating axis with B's face planes
		let faceB = [0];
		let penetrationB = this.findAxisLeastPenetration(faceB, B, A );
		if (penetrationB >= 0) {
			return;
		}

		let referenceIndex;
		let flip; // Always point from a to b

		let RefPoly; // Reference
		let IncPoly; // Incident

        const BIAS_RELATIVE = 0.95;
        const BIAS_ABSOLUTE = 0.01;

		// Determine which shape contains reference face
		if (penetrationA >=  penetrationB * BIAS_RELATIVE + penetrationA * BIAS_ABSOLUTE) {
			RefPoly = A;
			IncPoly = B;
			referenceIndex = faceA[0];
			flip = false;
		} else {
			RefPoly = B;
			IncPoly = A;
			referenceIndex = faceB[0];
			flip = true;
		}

		// World space incident face
		let incidentFace = [];

		this.findIncidentFace(incidentFace, RefPoly, IncPoly, referenceIndex);

		let v1 = RefPoly.vertices[referenceIndex].copia;
		referenceIndex = referenceIndex + 1 == RefPoly.vertexCount ? 0 : referenceIndex + 1;
		let v2 = RefPoly.vertices[referenceIndex].copia;

		v1.mult(RefPoly.u);
		v1.adic(RefPoly.corpo.posicao);
		
		v2.mult(RefPoly.u)
		v2.adic(RefPoly.corpo.posicao);

        let sidePlaneNormal = v2.copia
            .sub(v1)
		    .norm();

		let refFaceNormal = new Vetor2(sidePlaneNormal.y, -sidePlaneNormal.x);

		let refC = Vetor2.escalar(refFaceNormal, v1);
		let negSide = -Vetor2.escalar(sidePlaneNormal, v1);
		let posSide = Vetor2.escalar(sidePlaneNormal, v2);

		if (this.clip(sidePlaneNormal.copia.neg(), negSide, incidentFace) < 2) {
			return;
		}

		if (this.clip( sidePlaneNormal, posSide, incidentFace ) < 2) {
			return;
		}

		m.normal.set(refFaceNormal);
		if (flip) {
			m.normal.neg();
		}

		let cp = 0;
		let separation = Vetor2.escalar(refFaceNormal, incidentFace[0]) - refC;
		if (separation <= 0) {
			m.contacts[cp].set(incidentFace[0]);
			m.penetration = -separation;
			++cp;
		} else {
			m.penetration = 0;
		}

		separation = Vetor2.escalar(refFaceNormal, incidentFace[1]) - refC;

		if (separation <= 0) {
			m.contacts[cp].set(incidentFace[1]);
			m.penetration += -separation;
			++cp;
			m.penetration /= cp;
		}

		m.contactCount = cp;
	}

	findAxisLeastPenetration(faceIndex, A, B) {
		let bestDistance = -Number.MAX_VALUE;
		let bestIndex = 0;

		for (let i = 0; i < A.vertexCount; ++i) {
			let nw = A.normals[i].copia.mult(A.u);

			let buT = B.u.copia.transp();
			let n = nw.copia.mult(B.u.copia.transp());

			let s = B.suporte(n.copia.neg());
			
			let vm = A.vertices[i].copia;
			vm.mult(A.u);
			vm.adic(A.corpo.posicao);
			vm.sub(B.corpo.posicao);
			vm.mult(buT);

			let d = Vetor2.escalar(n, s.copia.sub(vm));

			if (d > bestDistance)
			{
				bestDistance = d;
				bestIndex = i;
			}
		}

		faceIndex[0] = bestIndex;
		return bestDistance;
	}

	findIncidentFace(v, RefPoly, IncPoly, referenceIndex) {
		let referenceNormal = RefPoly.normals[referenceIndex].copia;
		referenceNormal.mult(RefPoly.u);
		referenceNormal.mult(IncPoly.u.copia.transp());
					
		let incidentFace = 0;
		let minDot = Number.MAX_VALUE;
		for (let i = 0; i < IncPoly.vertexCount; ++i) {
			let dot = Vetor2.escalar(referenceNormal, IncPoly.normals[i]);

			if (dot < minDot) {
				minDot = dot;
				incidentFace = i;
			}
		}

		v[0] = IncPoly.vertices[incidentFace].copia;
		v[0].mult(IncPoly.u);
		v[0].adic(IncPoly.corpo.posicao);

		
		incidentFace = incidentFace + 1 >= IncPoly.vertexCount ? 0 : incidentFace + 1;

		v[1] = IncPoly.vertices[incidentFace].copia;
		v[1].mult(IncPoly.u);
		v[1].adic(IncPoly.corpo.posicao);
	}

	clip(n, c, face) {
		let sp = 0;
		let out = [ new Vetor2(face[0]), new Vetor2(face[1])];

		let d1 = Vetor2.escalar(n, face[0]) - c;
		let d2 = Vetor2.escalar(n, face[1]) - c;

		if (d1 <= 0) out[sp++].set(face[0]);
		if (d2 <= 0) out[sp++].set(face[1]);

		if (d1 * d2 < 0) {
			let alpha = d1 / (d1 - d2);
			out[sp++].set(face[1]).sub( face[0] ).mult( alpha ).adic( face[0] );
		}

		face[0] = out[0];
		face[1] = out[1];

		return sp;
	}

}

export class Mundo2 {
	constructor(dt, iterations) {
		this.dt = dt;
        this.iterations = iterations;
        this.bodies = [];
	    this.contacts = [];
	}

	step() {
		this.contacts=[];
		for (let i=0; i < this.bodies.length; ++i) {
			let A = this.bodies[i];

			for (let j = i + 1; j < this.bodies.length; ++j) {
				let B = this.bodies[j];

				if (A.massaInv == 0 && B.massaInv == 0) {
					continue;
				}

				let m = new Manifold(A, B);
				m.solve();

				if (m.contactCount > 0) {
					this.contacts.push(m);
				}
			}
		}

		// Integrate forces
		for (let corpo of this.bodies) {
			this.integrateForces(corpo, this.dt );
		}

		for (let i = 0; i < this.contacts.length; ++i) {
			this.contacts[i].initialize();
		}

		for (let j = 0; j < this.iterations; ++j) {
			for (let i = 0; i < this.contacts.length; ++i)
			{
				this.contacts[i].applyImpulse();
			}
		}

		for (let corpo of this.bodies) {
			this.integrateVelocity(corpo, this.dt);
		}

		for (let i = 0; i < this.contacts.length; ++i) {
			this.contacts[i].positionalCorrection();
		}

		for (let corpo of this.bodies) {
			corpo.forca.set(0, 0);
			corpo.torque = 0;
		}
	}

	add(shape, x, y) {
		let b = new Corpo(shape, x, y);
		this.bodies.push(b);
		return b;
	}

	clear() {
		this.contacts.clear();
		this.bodies.clear();
	}

	integrateForces(b, dt ) {
		if (b.massaInv == 0) {
			return;
		}

		let dts = dt * 0.5;

		b.velocidade.adic(b.forca.copia.mult(b.massaInv * dts));
		b.velocidade.adic(Global.GRAVITY.copia.mult(dts));
		b.velocidadeAngular += b.torque * b.inerciaInv * dts;
	}

	integrateVelocity(b, dt) {
		if (b.massaInv == 0) {
			return;
		}

		b.posicao.adic(b.velocidade.copia.mult(dt));
		b.orientacao += b.velocidadeAngular * dt;

		this.integrateForces(b, dt);
	}

}

export const Global = {
	EPSILON: 0.0001,
    GRAVITY: new Vetor2(0, 50),
	DT: 1/60
}
Global.RESTING = Global.GRAVITY.copia.mult(Global.DT).magQ + Global.EPSILON;