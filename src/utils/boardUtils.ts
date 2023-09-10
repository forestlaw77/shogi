import { PieceType, DirType, Piece } from "../types/pieceTypes";
import { PIECES } from "../constants/constants";

/**
 * Generate the initial game board for a shogi game.
 *
 * @returns {Piece[][]} The initial game board represented as a 2D array of Cell objects.
 */
export const generateInitialBoard = () => {
  // an object representing an empty cell
  const emptyCell = {
    type: PieceType.None,
    direction: DirType.None,
    canPromote: false,
  };

  // Generate an initial shogi board
  const board: Piece[][] = [
    // 1st line
    [
      { type: PieceType.Lance, direction: DirType.Down },
      { type: PieceType.Knight, direction: DirType.Down },
      { type: PieceType.Silver, direction: DirType.Down },
      { type: PieceType.Gold, direction: DirType.Down },
      { type: PieceType.King2, direction: DirType.Down },
      { type: PieceType.Gold, direction: DirType.Down },
      { type: PieceType.Silver, direction: DirType.Down },
      { type: PieceType.Knight, direction: DirType.Down },
      { type: PieceType.Lance, direction: DirType.Down },
    ],
    // 2nd line
    [
      emptyCell,
      { type: PieceType.Rook, direction: DirType.Down },
      emptyCell,
      emptyCell,
      emptyCell,
      emptyCell,
      emptyCell,
      { type: PieceType.Bishop, direction: DirType.Down },
      emptyCell,
    ],
    // 3rd line
    [
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
      { type: PieceType.Pawn, direction: DirType.Down },
    ],
    // 4th line
    Array(9).fill(emptyCell),
    // 5th line
    Array(9).fill(emptyCell),
    // 6th line
    Array(9).fill(emptyCell),
    // 7th line
    [
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
      { type: PieceType.Pawn, direction: DirType.Up },
    ],
    // 8th line
    [
      emptyCell,
      { type: PieceType.Bishop, direction: DirType.Up },
      emptyCell,
      emptyCell,
      emptyCell,
      emptyCell,
      emptyCell,
      { type: PieceType.Rook, direction: DirType.Up },
      emptyCell,
    ],
    // 9th line
    [
      { type: PieceType.Lance, direction: DirType.Up },
      { type: PieceType.Knight, direction: DirType.Up },
      { type: PieceType.Silver, direction: DirType.Up },
      { type: PieceType.Gold, direction: DirType.Up },
      { type: PieceType.King1, direction: DirType.Up },
      { type: PieceType.Gold, direction: DirType.Up },
      { type: PieceType.Silver, direction: DirType.Up },
      { type: PieceType.Knight, direction: DirType.Up },
      { type: PieceType.Lance, direction: DirType.Up },
    ],
  ];

  return board;
};

export const getImage = (type: PieceType, direction: DirType) => {
  const piece = PIECES.find(
    (piece) => piece.type === type && piece.direction === direction
  );
  return piece ? piece.image : "";
};

/**
 * Checks if a cell is movable.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {boolean} - True if the cell is movable, false otherwise.
 */
export const isMovable = (
  row: number,
  col: number,
  movableCells: number[][]
) => {
  return movableCells.some(
    (position) => position[0] === row && position[1] === col
  );
};

export const getPromotedPieceType = (
  dstRow: number,
  srcRow: number,
  cell: Piece
) => {
  if (
    (cell.direction === DirType.Up && dstRow < 3) ||
    (cell.direction === DirType.Up && srcRow < 3) ||
    (cell.direction === DirType.Down && dstRow > 5) ||
    (cell.direction === DirType.Down && srcRow > 5)
  ) {
    const pieceInfo = PIECES.filter((piece) => piece.type === cell.type);
    return pieceInfo[0].promoted;
  }
  return PieceType.None;
};

export const isNifu = (col: number, cell: Piece, board: Piece[][]) => {
  let result = false;
  if (cell.type === PieceType.Pawn) {
    for (let i = 0; i < board.length; i++) {
      const checkCell = board[i][col];
      if (
        checkCell.type === PieceType.Pawn &&
        checkCell.direction === cell.direction
      ) {
        result = true;
        break;
      }
    }
  }
  return result;
};

/* 「打ち歩詰め」を判定するためには、先読みが必要
export const isUchifuzume = () => {
};
*/
