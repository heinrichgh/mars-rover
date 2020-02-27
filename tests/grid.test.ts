import Grid from "../src/grid";

test.each([
    [5, 4,],
    [101, 50],
    [56, 4],
])("given width and height grid is size width*height", (width, height) => {
    const grid = new Grid(width, height);

    expect(grid.size()).toBe(width * height);
});

test.each([
    [5, 4,],
    [101, 50],
    [56, 4],
])("when height is a float it should round down", (width, height) => {
    const grid = new Grid(width, height + 0.7);

    expect(grid.size()).toBe(width * height);
});

test.each([
    [5, 4,],
    [101, 50],
    [56, 4],
])("when width is a float it should round down", (width, height) => {
    const grid = new Grid(width + 0.7, height);

    expect(grid.size()).toBe(width * height);
});

test.each([
    [5, 4, 5, 4],
    [101, 50, 0, 0],
    [56, 4, 56, 0],
    [56, 4, 0, 4],
    [56, 56, 25, 25],
])("when coordinates are on the grid return true", (width, height, x, y) => {
    const grid = new Grid(width, height);

    expect(grid.isOnGrid(x, y)).toBe(true);
});

test.each([
    [5, 4, 6, 4],
    [101, 50, 1, -1],
    [56, 4, 57, 0],
    [56, 4, 0, 5],
    [56, 56, -1, -1],
])("when coordinates are not on the grid return false", (width, height, x, y) => {
    const grid = new Grid(width, height);

    expect(grid.isOnGrid(x, y)).toBe(false);
});