import {
  PieceType,
  DirType,
  Piece,
  PlayerType,
  GameState,
  Cell,
} from "../types/pieceTypes";
import {
  ORIGINAL_PIECES,
  PROMOTION_PIECES,
  TAP_DELAY,
} from "../constants/constants";

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

export const kanji2Number = (letter: string) => {
  const kanjiNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const number: number = kanjiNumbers.indexOf(letter);

  return number < 0 ? number : number + 1;
};

/**
 * Checks if a given row and column match the previous destination position.
 *
 * @param {number} row - The row to check.
 * @param {number} col - The column to check.
 * @returns {boolean} True if the row and column match the previous destination position, false otherwise.
 */
const prevDstPosition: { row: number; col: number } = { row: -1, col: -1 };
export const isSameDst = (row: number, col: number) => {
  const result = prevDstPosition.row === row && prevDstPosition.col === col;
  setPrevDstPosition(row, col);
  return result;
};

export const setPrevDstPosition = (row: number, col: number) => {
  prevDstPosition.row = row;
  prevDstPosition.col = col;
};

export const resetPrevDstPosition = () => {
  setPrevDstPosition(-1, -1);
};

/**
 * Removes a piece from the player's hold pieces.
 *
 * @param {GameState["holdPieces"]} holdPieces - The current hold pieces state.
 * @param {PlayerType} owner - The owner of the piece to remove.
 * @param {PieceType} pieceType - The type of the piece to remove.
 * @returns {GameState["holdPieces"]} The updated hold pieces state.
 */
export const removeHoldPiece = (
  holdPieces: GameState["holdPieces"],
  owner: PlayerType,
  pieceType?: PieceType
) => {
  const newHoldPieces = structuredClone(holdPieces);
  const ownerKey =
    owner === PlayerType.Black ? PlayerType.Black : PlayerType.White;
  const targetPieceIndex = newHoldPieces[ownerKey].findIndex(
    (piece) => piece.type === pieceType
  );

  if (targetPieceIndex !== -1) {
    const targetPiece = newHoldPieces[ownerKey][targetPieceIndex];
    if (targetPiece.count > 0) {
      targetPiece.count--;

      if (targetPiece.count === 0) {
        newHoldPieces[ownerKey].splice(targetPieceIndex, 1);
      }
    }
  }

  return newHoldPieces;
};

/**
 * Adds a piece to the player's hold pieces.
 *
 * @param {GameState["holdPieces"]} holdPieces - The current hold pieces state.
 * @param {PlayerType} owner - The owner of the piece to add.
 * @param {PieceType | null} pieceType - The type of the piece to add.
 * @returns {GameState["holdPieces"]} The updated hold pieces state.
 */
export const addHoldPiece = (
  holdPieces: GameState["holdPieces"],
  owner: PlayerType,
  pieceType: PieceType | null
) => {
  const newHoldPieces = structuredClone(holdPieces);
  const ownerKey =
    owner === PlayerType.Black ? PlayerType.Black : PlayerType.White;
  const targetPiece = newHoldPieces[ownerKey].find(
    (piece) => piece.type === pieceType
  );

  if (targetPiece) {
    targetPiece.count++;
  } else if (pieceType) {
    newHoldPieces[ownerKey].push({ type: pieceType, count: 1 });
  }

  return newHoldPieces;
};

export const havePiece = (cell: Cell) => {
  return cell.piece !== null;
};
