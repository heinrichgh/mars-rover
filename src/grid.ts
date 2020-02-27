class Grid {
    private readonly _width : number;
    private readonly _height : number;

    constructor(width : number, height: number) {
        this._width = Math.floor(width);
        this._height = Math.floor(height);
    }

    size() {
        return this._width * this._height;
    }

    isOnGrid(x: number, y: number) {
        return this.isWithinWidthBoundary(x) && this.isWithinHeightBoundary(y);
    }

    private isWithinWidthBoundary(x: number) {
        return x >= 0 && x <= this._width;
    }

    private isWithinHeightBoundary(y: number) {
        return y >= 0 && y <= this._height;
    }
}

export default Grid;