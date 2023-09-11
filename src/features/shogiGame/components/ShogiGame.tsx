import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import "./Shogi.css";
import { PieceType, DirType, Piece, Player } from "../../../types/pieceTypes";
import {
  BOARD_SIZE,
  MOVABLE_RANGES,
  PIECE_DIRECTIONS,
  PIECE_SIZE,
  ORIGINAL_PIECES,
} from "../../../constants/constants";
import {
  isMovable,
  getPromotedPieceType,
  isNifu,
  handleCellClick,
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

interface ShogiProps {
  initialBoard: Piece[][];
  initialHoldPieces: Piece[];
  isFreeMode: boolean;
}

/**
 * The main Shogi component that manages the game state and logic.
 */
const Shogi: React.FC<ShogiProps> = ({
  initialBoard,
  initialHoldPieces,
  isFreeMode,
}) => {
  const [board, setBoard] = useState(initialBoard);
  const [holdPieces, setHoldPieces] = useState<Piece[]>(initialHoldPieces);
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [movableCells, setMovableCells] = useState<number[][]>([]);
  const [selectedHoldPiece, setSelectedHoldPiece] = useState<Piece | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<number>(Player.black);
  const [isFree, setIsFree] = useState(isFreeMode);

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
   */
  const singleClickFunc = (row: number, col: number) => {
    if (selectedHoldPiece) {
      // Handle putting a hold piece
      handleHoldPiecePut(row, col, board);
    } else if (selectedPiece) {
      // Handle putting a selected piece
      handleSelectPiecePut(row, col, board, false);
    } else if (board[row][col].type !== PieceType.None) {
      if (isFree || (!isFree && board[row][col].direction === currentPlayer)) {
        // Select a piece and calculate movable cells
        setSelectedPiece({ row: row, col: col });
        calculateMovableCells(row, col, board[row][col]);
      }
    }
  };

  /**
   * Handles the double click event on a cell, including promoting a selected piece if applicable.
   *
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  const doubleClickFunc = (row: number, col: number) => {
    if (selectedPiece) {
      // Handle putting a selected piece with promotion check
      handleSelectPiecePut(row, col, board, true);
    }
  };

  /**
   * Handles a click event on a cell in the front-end display, delegating the action to appropriate click functions.
   *
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  const handleFrontCellClick = (row: number, col: number) => {
    // Delegate the click action to appropriate click functions
    handleCellClick(row, col, singleClickFunc, doubleClickFunc);
  };

  const playerChange = (currentPlayer: Player) => {
    if (!isFree) {
      setCurrentPlayer(
        currentPlayer === Player.black ? Player.white : Player.black
      );
    }
  };

  /**
   * Handles the placement of a selected piece on the board.
   *
   * @param {number} row - The row index where the piece will be placed.
   * @param {number} col - The column index where the piece will be placed.
   * @param {Piece[][]} board - The current game board represented as a 2D array of cells.
   * @param {boolean} autoPromotion - A flag indicating whether auto-promotion should occur.
   */
  const handleSelectPiecePut = (
    row: number,
    col: number,
    board: Piece[][],
    autoPromotion: boolean
  ) => {
    if (!selectedPiece) {
      return;
    }
    if (selectedPiece.row === row && selectedPiece.col === col) {
      setSelectedPiece(null);
      setMovableCells([]);
      return;
    }
    playerChange(currentPlayer);
    const newBoard = structuredClone(board);
    if (isMovable(row, col, movableCells)) {
      const selectedCell = newBoard[selectedPiece.row][selectedPiece.col];
      const promoted = getPromotedPieceType(
        row,
        selectedPiece.row,
        selectedCell
      );
      if (!promoted) {
        newBoard[row][col] = selectedCell;
      } else {
        let shouldPromote = false;
        if (
          autoPromotion ||
          ((selectedCell.type === PieceType.Pawn ||
            selectedCell.type === PieceType.Lance) &&
            ((selectedCell.direction === DirType.Up && row === 0) ||
              (selectedCell.direction === DirType.Down && row === 8))) ||
          (selectedCell.type === PieceType.Knight &&
            ((selectedCell.direction === DirType.Up && row < 2) ||
              (selectedCell.direction === DirType.Down && row > 6)))
        ) {
          shouldPromote = true;
        } else {
          shouldPromote = window.confirm("成りますか？");
        }

        if (shouldPromote) {
          newBoard[row][col] = { ...selectedCell, type: promoted };
        } else {
          newBoard[row][col] = selectedCell;
        }
      }
      newBoard[selectedPiece.row][selectedPiece.col] = {
        type: PieceType.None,
        direction: DirType.None,
      };

      if (
        board[row][col].type !== PieceType.None &&
        board[row][col].direction !== selectedCell.direction
      ) {
        const newHoldPieces = [...holdPieces];

        newHoldPieces.push({
          type: ORIGINAL_PIECES[board[row][col].type] || board[row][col].type,
          direction: selectedCell.direction,
        });

        setHoldPieces(newHoldPieces);
      }
      setBoard(newBoard);
      setSelectedPiece(null);
      setMovableCells([]);
    }
  };

  /**
   * Handles the placement of a selected piece from the hold pieces area onto the board.
   *
   * @param {number} row - The row index where the piece will be placed.
   * @param {number} col - The column index where the piece will be placed.
   * @param {Piece[][]} board - The current game board represented as a 2D array of cells.
   */
  const handleHoldPiecePut = (row: number, col: number, board: Piece[][]) => {
    if (!selectedHoldPiece) {
      return;
    }
    playerChange(currentPlayer);
    const newBoard = structuredClone(board);
    if (newBoard[row][col].type === PieceType.None) {
      if (isNifu(col, selectedHoldPiece, board)) {
        alert("二歩は反則です。");
      } else {
        newBoard[row][col] = selectedHoldPiece;
        const newHoldPieces = structuredClone(holdPieces);
        newHoldPieces.splice(
          newHoldPieces.findIndex(
            ({ type, direction }) =>
              type === selectedHoldPiece.type &&
              direction === selectedHoldPiece.direction
          ),
          1
        );
        setHoldPieces(newHoldPieces);
        setBoard(newBoard);
      }
    }
    setSelectedHoldPiece(null);
  };

  /**
   * Handles the click event on a piece in the hold pieces area, toggling the selection state.
   *
   * @param {Piece} cell - The piece in the hold pieces area that was clicked.
   */
  const handleHoldPieceClick = (cell: Piece) => {
    if (selectedHoldPiece) {
      setSelectedHoldPiece(null);
    } else {
      if (isFree || cell.direction === currentPlayer) {
        setSelectedHoldPiece(cell);
      }
    }
  };

  return (
    <>
      <Box h={PIECE_SIZE.height * 2}>
        <HoldPieces
          holdPieces={holdPieces}
          direction={DirType.Down}
          handleOnClick={handleHoldPieceClick}
          selectedHoldPiece={selectedHoldPiece}
        />
      </Box>
      <Board
        board={board}
        handleCellClick={handleFrontCellClick}
        selectedPiece={selectedPiece}
        movableCells={movableCells}
      />
      <Box h={PIECE_SIZE.height * 1.5}>
        <HoldPieces
          holdPieces={holdPieces}
          direction={DirType.Up}
          handleOnClick={handleHoldPieceClick}
          selectedHoldPiece={selectedHoldPiece}
        />
      </Box>
      {!isFree && (
        <Box>
          CurrentPlayer: {currentPlayer === Player.black ? "先手" : "後手"}
        </Box>
      )}
      <Button onClick={() => setIsFree(!isFree)}>
        {isFree ? "ゲームモードへ" : "盤面編集モードへ"}
      </Button>

      <Box>
        「成り」が可能なときに、移動先のセルをダブルタップすると、成ります。
      </Box>
    </>
  );
};

export default Shogi;
