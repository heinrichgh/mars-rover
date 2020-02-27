import Rover from "../src/rover";
import Direction from "../src/direction";
import Grid from "../src/grid";

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('north facing rover at coordinates (%i, %i), should move one position north', (x, y) => {
    const grid = new Grid(x, y * 2);
    const rover = new Rover(Direction.North, grid);

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x);
    expect(newPosition.y).toBe(y + 1);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('east facing rover at coordinates (%i, %i), should move one position east', (x, y) => {
    const grid = new Grid(x * 2, y);
    const rover = new Rover(Direction.East, grid);

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x + 1);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('south facing rover at coordinates (%i, %i), should move one position south', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.South, grid);

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x);
    expect(newPosition.y).toBe(y - 1);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('west facing rover at coordinates (%i, %i), should move one position west', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.West, grid);

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x - 1);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('north facing rover on northern border should stay at current position when asked to move', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.North, grid);

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('east facing rover on eastern border should stay at current position when asked to move', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.East, grid);

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5],
    [2],
    [8],
])('south facing rover on southern border should stay at current position when asked to move', (x) => {
    const grid = new Grid(x, x);
    const rover = new Rover(Direction.South, grid);

    const newPosition = rover.moveFrom(x, 0);

    expect(newPosition.x).toBe(x);
    expect(newPosition.y).toBe(0);
});

test.each([
    [5],
    [2],
    [8],
])('west facing rover on western border should stay at current position when asked to move', (y) => {
    const grid = new Grid(y, y);
    const rover = new Rover(Direction.West, grid);

    const newPosition = rover.moveFrom(0, y);

    expect(newPosition.x).toBe(0);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('north facing rover at coordinates (%i, %i), after turned left, should move one position west', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.North, grid);
    rover.rotateLeft();

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x - 1);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('north facing rover at coordinates (%i, %i), after turned right, should move one position east', (x, y) => {
    const grid = new Grid(x * 2, y);
    const rover = new Rover(Direction.North, grid);
    rover.rotateRight();

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x + 1);
    expect(newPosition.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('east facing rover at coordinates (%i, %i), after turned left, should move one position north', (x, y) => {
    const grid = new Grid(x, y * 2);
    const rover = new Rover(Direction.East, grid);
    rover.rotateLeft();

    const newPosition = rover.moveFrom(x, y);

    expect(newPosition.x).toBe(x);
    expect(newPosition.y).toBe(y + 1);
});

// test.each([
//     [5, 4,],
//     [2, 3],
//     [8, 1],
// ])('east facing rover at coordinates (%i, %i), after turned right, should move one position south', (x, y) => {
//     const grid = new Grid(x, y);
//     const rover = new Rover(Direction.East, grid);
//     rover.rotateRight();
//
//     const newPosition = rover.moveFrom(x, y);
//
//     expect(newPosition.x).toBe(x);
//     expect(newPosition.y).toBe(y - 1);
// });