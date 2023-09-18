import { PieceType, DirType, Piece, PlayerType } from "../types/pieceTypes";
import {
  ORIGINAL_PIECES,
  PIECES,
  PROMOTION_PIECES,
  TAP_DELAY,
} from "../constants/constants";

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

/**
 * Retrieves the image URL for a given piece type and direction.
 *
 * @param {PieceType} type - The type of the piece.
 * @param {DirType} direction - The direction of the piece.
 * @returns {string} The URL of the image representing the piece.
 */
export const getImage = (type?: PieceType, direction?: DirType) => {
  const piece = PIECES.find((piece) => piece.type === type);
  return direction === DirType.Up ? piece?.UpImage : piece?.DownImage;
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

/**
 * Determines the promoted piece type based on the destination row, source row, and the current piece.
 *
 * @param {number} dstRow - The row index of the destination cell.
 * @param {number} srcRow - The row index of the source cell.
 * @param {Piece} piece - The cell containing the piece.
 * @returns {PieceType} The promoted piece type, or PieceType.None if no promotion is required.
 */
export const canPromote = (
  dstRow: number,
  srcRow: number,
  piece: Piece | null
) => {
  if (
    piece &&
    ((piece.direction === DirType.Up && dstRow < 3) ||
      (piece.direction === DirType.Up && srcRow < 3) ||
      (piece.direction === DirType.Down && dstRow > 5) ||
      (piece.direction === DirType.Down && srcRow > 5))
  ) {
    const promotedPieceType = getPromotedPieceType(piece.type);
    if (promotedPieceType) {
      return true;
    }
  }
  return false;
};

/**
 * Get the promoted piece type for a given piece type.
 *
 * @param {PieceType|null|undefined} type - The original piece type.
 * @returns {PieceType|undefined} The promoted piece type.
 */
export const getPromotedPieceType = (type: PieceType | undefined | null) => {
  return type ? PROMOTION_PIECES[type] : undefined;
};

/**
 * Get the original piece type for a given piece type.
 *
 * @param {PieceType|null|undefined} type - The promoted piece type.
 * @returns {PieceType|undefined} The original piece type.
 */
export const getOriginalPieceType = (type: PieceType | undefined | null) => {
  return type ? ORIGINAL_PIECES[type] : undefined;
};

/**
 * Checks if placing a pawn at a specific column would result in a "nifu" violation (two pawns in the same column).
 *
 * @param {number} col - The column index to check for "nifu" violation.
 * @param {Piece} cell - The cell containing the pawn to be placed.
 * @param {Piece[][]} board - The current game board.
 * @returns {boolean} Returns true if placing the pawn would violate "nifu," otherwise false.
 */
export const isNifu = (col: number, cell: Piece, board: (Piece | null)[][]) => {
  let result = false;
  if (cell && cell.type === PieceType.Pawn) {
    for (let i = 0; i < board.length; i++) {
      const checkCell = board[i][col];
      if (
        checkCell &&
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

/**
 * Handles the click event on a cell, triggering either a single or double click action.
 *
 * @param {number} row - The row index of the clicked cell.
 * @param {number} col - The column index of the clicked cell.
 * @param {Function} singleClickFunc - The function to execute for a single click.
 * @param {Function} doubleClickFunc - The function to execute for a double click.
 */
let clickCount = 0;
export const handleCellClick = (
  row: number,
  col: number,
  singleClickFunc: (row: number, col: number) => void,
  doubleClickFunc: (row: number, col: number) => void
) => {
  clickCount++;

  if (clickCount < 2) {
    setTimeout(() => {
      if (clickCount < 2) {
        singleClickFunc(row, col);
      }
      clickCount = 0;
    }, TAP_DELAY);
  } else {
    doubleClickFunc(row, col);
  }
};

/**
 * Convert a numeric digit to its corresponding Kanji character (1-9).
 *
 * @param {number} number - The numeric digit (1-9) to convert to Kanji.
 * @returns {string} The Kanji representation of the numeric digit, or "Invalid Number" if the input is out of range.
 */
export const number2Kanji = (number: number) => {
  const kanjiNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

  if (number >= 1 && number <= 9) {
    return kanjiNumbers[number - 1];
  } else {
    return "Invalid Number";
  }
};
export const number2Zenkaku = (number: number) => {
  const zenkakuNumbers = ["１", "２", "３", "４", "５", "６", "７", "８", "９"];

  if (number >= 1 && number <= 9) {
    return zenkakuNumbers[number - 1];
  } else {
    return "Invalid Number";
  }
};

export const kanji2Number = (letter: string) => {
  const kanjiNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const number: number = kanjiNumbers.indexOf(letter);

  return number < 0 ? number : number + 1;
};
