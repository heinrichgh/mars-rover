class Position {
    public readonly x : number;
    public readonly y : number;

    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }

    equals(other : Position) {
        return this.x == other.x && this.y == other.y;
    }
}

export default Position;