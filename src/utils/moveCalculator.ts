import {
  BOARD_SIZE,
  MOVABLE_RANGES,
  PIECE_DIRECTIONS,
} from "../constants/constants";
import { DirType, Piece, PlayerType } from "../types/pieceTypes";

/**
 * Calculates the valid movable cells for a selected piece and updates the state.
 *
 * @param {number} row - The row index of the selected piece.
 * @param {number} col - The column index of the selected piece.
 * @param {Piece} cell - The selected piece.
 */
export const calculateMovableCells = (
  row: number,
  col: number,
  cell: Piece,
  board: (Piece | null)[][]
) => {
  if (!cell || !cell.type) return [];

  const movableCells: number[][] = [];
  const movableRange: number[] = MOVABLE_RANGES[cell.type];

  if (movableRange) {
    for (let dir = 0; dir < PIECE_DIRECTIONS.length; dir++) {
      const [dx, dy] = PIECE_DIRECTIONS[dir];
      const new_dy = cell.direction === DirType.Up ? dy : -dy;
      let newRow = row;
      let newCol = col;

      for (let i = 0; i < movableRange[dir]; i++) {
        newRow += new_dy;
        newCol += dx;
        if (isWithinBoardBounds(newRow, newCol)) {
          if (isOwnPiece(newRow, newCol, board, cell.owner)) {
            break;
          } else {
            movableCells.push([newRow, newCol]);
            if (isOpponentPiece(newRow, newCol, board, cell.owner)) {
              break;
            }
          }
        } else {
          break;
        }
      }
    }
  }
  return movableCells;
};

/**
 * Determines if a given cell is within the bounds of the game board.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {boolean} - True if the cell is within the board bounds, false otherwise.
 */
export const isWithinBoardBounds = (row: number, col: number) => {
  return row >= 0 && row < BOARD_SIZE.rows && col >= 0 && col < BOARD_SIZE.cols;
};

/**
 * Checks if a cell contains an opponent's piece.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @param {Piece[][]} board - The game board.
 * @param {DirType} direction - The direction of the current player.
 * @returns {boolean} - True if the cell contains an opponent's piece, false otherwise.
 */
export const isOpponentPiece = (
  row: number,
  col: number,
  board: (Piece | null)[][],
  owner?: PlayerType
) => {
  const targetPiece = board[row][col];
  return targetPiece && targetPiece.owner !== owner;
};

/**
 * Checks if a cell contains the player's own piece.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @param {Piece[][]} board - The game board.
 * @param {DirType} direction - The direction of the current player.
 * @returns {boolean} - True if the cell contains the player's own piece, false otherwise.
 */
export const isOwnPiece = (
  row: number,
  col: number,
  board: (Piece | null)[][],
  owner?: PlayerType
) => {
  const targetPiece = board[row][col];
  return targetPiece && targetPiece.owner === owner;
};
