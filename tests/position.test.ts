import Position from "../src/position";

test.each([
    [5, 4],
    [2, 1],
    [20, 400],
])("given points %i, %i create Position with a corresponding x and y", (x, y) => {
   const position = new Position(x, y);

   expect(position.x).toBe(x);
   expect(position.y).toBe(y);
});

test.each([
    [5, 4],
    [2, 1],
    [20, 400],
])("two points with the same x and y should be equal", (x, y) => {
    const position = new Position(x, y);
    const otherPosition = new Position(x, y);

    expect(position.equals(otherPosition)).toBe(true);
});