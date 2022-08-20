import { rectangularCollision } from "./rectangularCollision";

const OFFSET = 3;

const getUpPosition = ({ position }) => ({
  x: position.x,
  y: position.y + OFFSET,
});

const getDownPosition = ({ position }) => ({
  x: position.x,
  y: position.y - OFFSET,
});

const getRightPosition = ({ position }) => ({
  x: position.x - OFFSET,
  y: position.y,
});

const getLeftPosition = ({ position }) => ({
  x: position.x + OFFSET,
  y: position.y,
});

const mapPosition = {
  up: getUpPosition,
  down: getDownPosition,
  right: getRightPosition,
  left: getLeftPosition,
};

export const checkCollision = ({
  direction,
  player,
  boundaries,
  collisionCallback,
}) => {
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: mapPosition[direction](boundary),
        },
      })
    ) {
      collisionCallback();
      break;
    }
  }
};
