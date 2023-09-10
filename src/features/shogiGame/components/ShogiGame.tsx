import { useState } from "react";
import "./Shogi.css";
import { PieceType, DirType, Piece } from "../../../types/pieceTypes";
import {
  BOARD_SIZE,
  MOVABLE_RANGES,
  PIECES,
  PIECE_DIRECTIONS,
} from "../../../constants/constants";
import {
  generateInitialBoard,
  isMovable,
  getPromotedPieceType,
  isNifu,
} from "../../../utils/boardUtils";
import HoldPieces from "../../../components/HoldPieces";
import Board from "../../../components/Board";

/**
 * Determines if a given cell is within the bounds of the game board.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {boolean} - True if the cell is within the board bounds, false otherwise.
 */
const isWithinBoardBounds = (row: number, col: number) => {
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
const isOpponentPiece = (
  row: number,
  col: number,
  board: Piece[][],
  direction: DirType
) => {
  return (
    board[row][col].direction !== direction &&
    board[row][col].type !== PieceType.None
  );
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
const isOwnPiece = (
  row: number,
  col: number,
  board: Piece[][],
  direction: DirType
) => {
  return board[row][col].direction === direction;
};

/**
 * The main Shogi component that manages the game state and logic.
 */
const Shogi = () => {
  const [board, setBoard] = useState(generateInitialBoard());
  const [holdPieces, setHoldPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
    cell: Piece;
  } | null>(null);
  const [movableCells, setMovableCells] = useState<number[][]>([]);
  const [selectedHoldPiece, setSelectedHoldPiece] = useState<Piece | null>(
    null
  );

  /**
   * Calculates the valid movable cells for a selected piece and updates the state.
   *
   * @param {number} row - The row index of the selected piece.
   * @param {number} col - The column index of the selected piece.
   * @param {Piece} cell - The selected piece.
   */
  const calculateMovableCells = (row: number, col: number, cell: Piece) => {
    if (!cell || cell.type === PieceType.None) return;

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
            if (isOwnPiece(newRow, newCol, board, cell.direction)) {
              break;
            } else {
              movableCells.push([newRow, newCol]);
              if (isOpponentPiece(newRow, newCol, board, cell.direction)) {
                break;
              }
            }
          } else {
            break;
          }
        }
      }

      setMovableCells(movableCells);
    }
  };

  /**
   * Handles the click event on a cell, including moving pieces and capturing opponent pieces.
   *
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   * @param {Cell} cell - The cell that was clicked.
   */
  const handleCellClick = (row: number, col: number, cell: Piece) => {
    const newBoard = structuredClone(board);

    if (selectedHoldPiece) {
      if (newBoard[row][col].type === PieceType.None) {
        if (isNifu(col, selectedHoldPiece, board)) {
          alert("二歩は反則です。");
        } else {
          newBoard[row][col] = selectedHoldPiece;
          holdPieces.splice(holdPieces.indexOf(selectedHoldPiece));
          setHoldPieces([...holdPieces]);
          setBoard(newBoard);
        }
      }
      setSelectedHoldPiece(null);
      return;
    }

    if (selectedPiece && selectedPiece.cell) {
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setMovableCells([]);
        return;
      }
      if (isMovable(row, col, movableCells)) {
        const promoted = getPromotedPieceType(
          row,
          selectedPiece.row,
          selectedPiece.cell
        );
        if (promoted === PieceType.None) {
          newBoard[row][col] = selectedPiece.cell;
        } else {
          let shouldPromote = false;
          console.log(cell.type, cell.direction, row);
          if (
            ((selectedPiece.cell.type === PieceType.Pawn ||
              selectedPiece.cell.type === PieceType.Lance) &&
              ((selectedPiece.cell.direction === DirType.Up && row === 0) ||
                (selectedPiece.cell.direction === DirType.Down &&
                  row === 8))) ||
            (selectedPiece.cell.type === PieceType.Knight &&
              ((selectedPiece.cell.direction === DirType.Up && row < 2) ||
                (selectedPiece.cell.direction === DirType.Down && row > 6)))
          ) {
            shouldPromote = true;
          } else {
            shouldPromote = window.confirm("成りますか？");
          }

          if (shouldPromote) {
            newBoard[row][col] = { ...selectedPiece.cell, type: promoted };
          } else {
            newBoard[row][col] = selectedPiece.cell;
          }
        }
        newBoard[selectedPiece.row][selectedPiece.col] = {
          type: PieceType.None,
          direction: DirType.None,
        };
        if (
          board[row][col].type !== PieceType.None &&
          board[row][col].direction !== selectedPiece.cell.direction
        ) {
          const newHoldPieces = [...holdPieces];
          const pieceInfo = PIECES.find(
            (piece) => piece.type === board[row][col].type
          );
          if (!pieceInfo) {
            console.error("pieceInfo not Found (ShogiGame, handleCellClick)");
            newHoldPieces.push({
              ...board[row][col],
              direction: selectedPiece.cell.direction,
            });
          } else {
            newHoldPieces.push({
              type: pieceInfo.orgType,
              direction: selectedPiece.cell.direction,
            });
          }

          setHoldPieces(newHoldPieces);
        }
        setBoard(newBoard);
        setSelectedPiece(null);
        setMovableCells([]);
      }
    } else {
      if (cell !== null && cell.type !== PieceType.None) {
        setSelectedPiece({ row: row, col: col, cell: cell });
        calculateMovableCells(row, col, cell);
      }
    }
  };

  const handleHoldPieceClick = (cell: Piece) => {
    if (selectedHoldPiece) {
      setSelectedHoldPiece(null);
    } else {
      setSelectedHoldPiece(cell);
    }
  };

  return (
    <>
      <HoldPieces
        holdPieces={holdPieces}
        direction={DirType.Down}
        handleOnClick={handleHoldPieceClick}
        selectedHoldPiece={selectedHoldPiece}
      />
      <Board
        board={board}
        handleCellClick={handleCellClick}
        selectedPiece={selectedPiece}
        movableCells={movableCells}
      />
      <HoldPieces
        holdPieces={holdPieces}
        direction={DirType.Up}
        handleOnClick={handleHoldPieceClick}
        selectedHoldPiece={selectedHoldPiece}
      />
    </>
  );
};

export default Shogi;
