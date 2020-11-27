class vec4 {
    constructor(x, y, z, w) {
        this.x = x || 0; 
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    mult(num) {
        this.x *= num; 
        this.y *= num; 
        this.z *= num; 
        this.w *= num;
    }
}