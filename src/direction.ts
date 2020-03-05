enum Direction {
    North,
    East,
    South,
    West
}

export function DirectionToString(direction: Direction) {
    switch(direction) {
        case Direction.North:
            return "N";
        case Direction.East:
            return "E";
        case Direction.South:
            return "S";
        case Direction.West:
            return "W";
    }
}

export default Direction;