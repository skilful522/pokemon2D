export const rectangularCollision = ({ rectangle1, rectangle2 }) => {
    const isLeftSideCollision =
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x;
    const isRightSideCollision =
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width;
    const isBottomSideCollision =
        rectangle1.position.y <= rectangle2.height + rectangle2.position.y;
    const isTopSideCollision =
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y;

    return (
        isLeftSideCollision &&
        isRightSideCollision &&
        isBottomSideCollision &&
        isTopSideCollision
    );
};
