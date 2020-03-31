using System.Collections.Generic;

namespace Core
{
    public class Rover
    {
        public Coordinate Coordinate { get; }
        public Rover(string testName, Coordinate coordinate, Direction direction, List<Movement> movement)
        {
            Coordinate = coordinate;
        }

    }
}