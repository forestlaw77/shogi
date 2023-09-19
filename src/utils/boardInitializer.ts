import { DirType, Piece, PieceType, PlayerType } from "../types/pieceTypes";

/**
 * Generate the initial game board for a shogi game.
 *
 * @returns {Piece[][]} The initial game board represented as a 2D array of Cell objects.
 */
export const generateInitialBoard = () => {
  // Generate an initial shogi board
  const board: Piece[][] = [
    // 1st line
    [
      PieceType.Lance,
      PieceType.Knight,
      PieceType.Silver,
      PieceType.Gold,
      PieceType.King2,
      PieceType.Gold,
      PieceType.Silver,
      PieceType.Knight,
      PieceType.Lance,
    ].map((type) => ({
      type,
      owner: PlayerType.White,
      direction: DirType.Down,
    })),
    // 2nd line
    [
      null,
      PieceType.Rook,
      null,
      null,
      null,
      null,
      null,
      PieceType.Bishop,
      null,
    ].map((type) =>
      type
        ? {
            type,
            owner: PlayerType.White,
            direction: DirType.Down,
          }
        : null
    ),
    // 3rd line
    Array(9).fill({
      type: PieceType.Pawn,
      owner: PlayerType.White,
      direction: DirType.Down,
    }),
    // 4th line
    Array(9).fill(null),
    // 5th line
    Array(9).fill(null),
    // 6th line
    Array(9).fill(null),
    // 7th line
    Array(9).fill({
      type: PieceType.Pawn,
      owner: PlayerType.Black,
      direction: DirType.Up,
    }),
    // 8th line
    [
      null,
      PieceType.Bishop,
      null,
      null,
      null,
      null,
      null,
      PieceType.Rook,
      null,
    ].map((type) =>
      type
        ? {
            type,
            owner: PlayerType.Black,
            direction: DirType.Up,
          }
        : null
    ),
    // 9th line
    [
      PieceType.Lance,
      PieceType.Knight,
      PieceType.Silver,
      PieceType.Gold,
      PieceType.King1,
      PieceType.Gold,
      PieceType.Silver,
      PieceType.Knight,
      PieceType.Lance,
    ].map((type) => ({
      type,
      owner: PlayerType.Black,
      direction: DirType.Up,
    })),
  ];

  return board;
};
