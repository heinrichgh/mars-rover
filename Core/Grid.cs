using System;

namespace Core
{
    public class Grid
    {
        private readonly int _width;
        private readonly int _height;

        public Grid(int width, int height)
        {
            _width = width;
            _height = height;
        }

        public void PlaceRover(Rover rover)
        {
            int roverX = rover.Coordinate.X;
            int roverY = rover.Coordinate.Y;

            if (roverX > _width)
            {
                throw new InvalidRoverPositionException();
            }
            if (roverX < 0)
            {
                throw new InvalidRoverPositionException();
            }
            if (roverY > _height)
            {
                throw new InvalidRoverPositionException();
            }
            if (roverY < 0)
            {
                throw new InvalidRoverPositionException();
            }
        }
    }
}