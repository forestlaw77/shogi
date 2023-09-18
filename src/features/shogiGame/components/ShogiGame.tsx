import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import "./Shogi.css";
import {
  PieceType,
  DirType,
  Piece,
  PlayerType,
  GameState,
  Move,
  Moved,
  //  HoldPiece,
} from "../../../types/pieceTypes";
import {
  BOARD_SIZE,
  MOVABLE_RANGES,
  PIECE_DIRECTIONS,
} from "../../../constants/constants";
import {
  isMovable,
  getPromotedPieceType,
  isNifu,
  handleCellClick,
  getOriginalPieceType,
  canPromote,
  number2Kanji,
  number2Zenkaku,
} from "../../../utils/boardUtils";
import Board from "../../../features/ShogiBoard/components/Board";
import Komadai from "../../../features/ShogiBoard/components/Komadai";
import Controller from "../../ShogiBoard/components/Controller";
import { Parsers } from "json-kifu-format";
import DisplayKifu from "../../ShogiBoard/components/DisplayKifu";
import DisplayMoveHistory from "../../ShogiBoard/components/DisplayMoveHistory";
//import { IHandFormat } from "json-kifu-format/dist/src/Formats";

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
const isOwnPiece = (
  row: number,
  col: number,
  board: (Piece | null)[][],
  owner?: PlayerType
) => {
  const targetPiece = board[row][col];
  return targetPiece && targetPiece.owner === owner;
};
/*
const textBoardAndHoldPieces = (
  board: (Piece | null)[][],
  holdPieces: GameState["holdPieces"]
) => {
  let kifu: string = "";
  // 後手の持駒を出力
  kifu = "後手の持駒：" + formatHoldPieces(holdPieces[PlayerType.White]) + "\n";
  kifu += "  ９ ８ ７ ６ ５ ４ ３ ２ １\n";
  kifu += "+---------------------------+\n";

  // 盤面を出力
  for (let row = 0; row < 9; row++) {
    let rowStr = "|";
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      const pieceStr = cell ? formatPiece(cell) : " ・";
      rowStr += pieceStr;
    }
    rowStr += "|" + number2Kanji(row + 1);
    kifu += rowStr + "\n";
  }

  kifu += "+---------------------------+\n";
  kifu +=
    "先手の持駒：" + formatHoldPieces(holdPieces[PlayerType.Black]) + "\n";
  return kifu;
};


function formatPiece(piece: Piece) {
  let pieceName: string = piece.type;
  if (piece.direction == DirType.Down) {
    pieceName = "v" + pieceName;
  } else {
    pieceName = " " + pieceName;
  }
  return pieceName;
}

function formatHoldPieces(holdPieces: HoldPiece[]) {
  return holdPieces.map((holdPiece) => {
    const pieceName: string = holdPiece.type;
    return pieceName + holdPiece.count.toString();
  });
}
*/
interface ShogiProps {
  initialGameState: GameState;
  mode: boolean;
  initialKifu: string;
  onBack: () => void;
}

const prevDstPosition: { row: number; col: number } = { row: -1, col: -1 };

/**
 * The main Shogi component that manages the game state and logic.
 */
const Shogi: React.FC<ShogiProps> = ({
  initialGameState,
  mode,
  initialKifu,
  onBack,
}) => {
  const [gameHistory, setGameHistory] = useState<GameState[]>([
    initialGameState,
  ]);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [board, setBoard] = useState<(Piece | null)[][]>(
    initialGameState.board
  );
  const [holdPieces, setHoldPieces] = useState<GameState["holdPieces"]>(
    initialGameState.holdPieces
  );
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [movableCells, setMovableCells] = useState<number[][]>([]);
  const [selectedHoldPiece, setSelectedHoldPiece] = useState<Piece | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>(
    initialGameState.currentPlayer
  );
  const [isEditMode, setIsEditMode] = useState(mode);
  const [historyIdx, setHistoryIdx] = useState(0);
  //console.log(initialMessages);
  const [moveHistoryString, setMoveHistoryString] = useState<string | null>(
    initialGameState.moveHistoryString
  );
  const [kifu, setKifu] = useState(initialKifu);
  const [canButton, setCanButton] = useState({
    rewind: false,
    foward: false,
    play: false,
  });

  useEffect(() => {
    setCanButton({
      rewind: historyIdx >= 1 && gameHistory.length >= 1,
      foward: historyIdx < gameHistory.length - 1,
      play: false,
    });
  }, [historyIdx, gameHistory.length]);

  /**
   * Handles a piece movement based on the game mode (Edit Mode or Play Mode).
   *
   * @param {Move} move - The move to execute.
   */
  const pieceMove = (move: Move) => {
    isEditMode ? editModeMove(move) : makeMove(move);
  };

  /**
   * Executes a piece movement in Edit Mode, updating the board and hold pieces.
   *
   * @param {Move} move - The move to execute in Edit Mode.
   */
  const editModeMove = (move: Move) => {
    const { srcCell, dstCell, dropPiece, wantPromote } = move;
    const newBoard = structuredClone(board);

    if (dropPiece) {
      // Drop
      setSelectedHoldPiece(null);
      if (!dstCell.piece) {
        newBoard[dstCell.row][dstCell.col] = dropPiece;
        const newHoldPieces = removeHoldPiece(
          holdPieces,
          dropPiece.owner,
          dropPiece.type
        );
        setHoldPieces(newHoldPieces);
      }
    } else if (srcCell && srcCell.piece) {
      // Move
      if (wantPromote) {
        const promoted =
          getPromotedPieceType(srcCell.piece.type) || srcCell.piece.type;
        newBoard[dstCell.row][dstCell.col] = {
          ...srcCell.piece,
          type: promoted,
        };
      } else {
        newBoard[dstCell.row][dstCell.col] = srcCell.piece;
      }

      newBoard[srcCell.row][srcCell.col] = dstCell.piece;

      setSelectedPiece(null);
      setMovableCells([]);
    } else {
      console.error(
        "srcCell or srcCell.piece is null or undefined at editModeMove()"
      );
    }
    setBoard(newBoard);
  };

  /**
   * Checks if a given row and column match the previous destination position.
   *
   * @param {number} row - The row to check.
   * @param {number} col - The column to check.
   * @returns {boolean} True if the row and column match the previous destination position, false otherwise.
   */
  const isSameDst = (row: number, col: number) => {
    const result = prevDstPosition.row === row && prevDstPosition.col === col;
    prevDstPosition.row = row;
    prevDstPosition.col = col;
    return result;
  };

  /**
   * Executes a move in the game and updates the game state.
   *
   * @param {GameState} gameState - The current game state.
   * @param {Move} move - The move to execute.
   * @returns {GameState | null} The updated game state, or null if the move is invalid.
   */
  const executeMove = (gameState: GameState, move: Move) => {
    const { srcCell, dstCell, dropPiece, wantPromote } = move;
    const newBoard = structuredClone(board);
    const newHoldPieces = structuredClone(holdPieces);
    const newGameState = {
      ...gameState,
      board: newBoard,
      holdPieces: newHoldPieces,
    };
    let isPromoted: boolean = false;

    if (dropPiece) {
      // drop
      setSelectedHoldPiece(null);
      if (dstCell.piece) {
        return null;
      }
      if (isNifu(dstCell.col, dropPiece, board)) {
        alert("Two-pawn rule violation.");
        return null;
      }
    }

    if (dropPiece) {
      // drop
      newBoard[dstCell.row][dstCell.col] = dropPiece;
      newGameState.holdPieces = removeHoldPiece(
        holdPieces,
        dropPiece.owner,
        dropPiece.type
      );
      setHoldPieces(newGameState.holdPieces);
    } else if (!srcCell || !srcCell.piece) {
      console.error("Logic error: srcCell & dropPiece is null at executeMove");
      return null;
    } else if (isMovable(dstCell.row, dstCell.col, movableCells)) {
      // move
      if (!canPromote(dstCell.row, srcCell.row, srcCell.piece)) {
        newBoard[dstCell.row][dstCell.col] = srcCell.piece;
      } else {
        let shouldPromote = false;
        if (
          wantPromote ||
          ((srcCell.piece.type === PieceType.Pawn ||
            srcCell.piece.type === PieceType.Lance) &&
            ((srcCell.piece.direction === DirType.Up && dstCell.row === 0) ||
              (srcCell.piece.direction === DirType.Down &&
                dstCell.row === 8))) ||
          (srcCell.piece.type === PieceType.Knight &&
            ((srcCell.piece.direction === DirType.Up && dstCell.row < 2) ||
              (srcCell.piece.direction === DirType.Down && dstCell.row > 6)))
        ) {
          shouldPromote = true;
        }
        if (shouldPromote) {
          newBoard[dstCell.row][dstCell.col] = {
            ...srcCell.piece,
            type:
              getPromotedPieceType(srcCell.piece.type) || srcCell.piece.type,
          };
          isPromoted = true;
        } else {
          newBoard[dstCell.row][dstCell.col] = srcCell.piece;
        }
      }
      newBoard[srcCell.row][srcCell.col] = null;

      // get enemy piece
      if (dstCell.piece && dstCell.piece.owner !== currentPlayer) {
        const enemyPieceType =
          getOriginalPieceType(dstCell.piece.type) || dstCell.piece.type;
        newGameState.holdPieces = addHoldPiece(
          holdPieces,
          currentPlayer,
          enemyPieceType
        );
        setHoldPieces(newGameState.holdPieces);
      }
      setSelectedPiece(null);
      setMovableCells([]);
    }
    setBoard(newBoard);

    const moved: Moved = {
      idx: historyIdx,
      src: srcCell
        ? { row: srcCell.row, col: srcCell.col }
        : { row: -1, col: -1 },
      dst: { row: dstCell.row, col: dstCell.col },
      type: dropPiece
        ? dropPiece.type
        : srcCell
        ? srcCell.piece
          ? srcCell.piece.type
          : PieceType.None
        : PieceType.None,
      isDropped: dropPiece !== null,
      isPromoted: isPromoted,
      isSameDst: isSameDst(dstCell.row, dstCell.col),
    };

    setMoveHistoryString(
      (prev) =>
        (newGameState.moveHistoryString = prev
          ? makeMovedMessage(moved) + "," + prev
          : makeMovedMessage(moved))
    );
    newGameState.currentPlayer =
      currentPlayer === PlayerType.Black ? PlayerType.White : PlayerType.Black;
    setCurrentPlayer(newGameState.currentPlayer);
    return newGameState;
  };

  /**
   * Creates a moved message based on the provided `Moved` object.
   *
   * @param {Moved} moved - The moved object containing move details.
   * @returns {string} The formatted moved message.
   */
  const makeMovedMessage = (moved: Moved) => {
    const { src, dst, type, isDropped, isPromoted, isSameDst } = moved;
    const pieceName: string = type;
    let message = "";

    // <指し手> = [<手番>]<移動先座標><駒>[<装飾子>]<移動元座標>
    let mover = currentPlayer === PlayerType.Black ? "☗" : "☖";
    if (isSameDst) {
      mover += "同　";
    } else {
      mover += `${number2Zenkaku(9 - dst.col)}${number2Kanji(dst.row + 1)}`;
    }
    mover += pieceName;
    if (isPromoted) {
      mover += "成";
    }
    if (isDropped) {
      mover += "打";
    } else {
      mover += `(${9 - src.col}${src.row + 1})`;
    }

    //message += (moved.idx + 1).toString().padStart(3, "0") + " " + mover;
    message += (moved.idx + 1).toString() + " " + mover;

    return message;
  };

  /**
   * Executes a move in the game and updates the game state.
   *
   * @param {Move} move - The move to execute.
   */
  const makeMove = (move: Move) => {
    const newGameState = executeMove(gameState, move);
    if (newGameState !== null) {
      setGameState(newGameState);
      gameHistory.length = historyIdx + 1;
      gameHistory.push(newGameState);
      setHistoryIdx((prev) => prev + 1);
    }
  };

  const handleControllerButton = (btn: string) => {
    switch (btn) {
      case "Back":
        onBack();
        break;
      case "Edit": // Edit Mode
        if (isEditMode) {
          {
            const newGameState = { ...gameState };
            newGameState.board = structuredClone(board);
            newGameState.holdPieces = structuredClone(holdPieces);
            setGameHistory([newGameState]);
            setMoveHistoryString(newGameState.moveHistoryString);
          }
          setIsEditMode(false);
          setHistoryIdx(0);
          setCurrentPlayer(PlayerType.Black);
        }
        setIsEditMode(!isEditMode);
        break;
      case "Rec": // Game Mode (Rec Move History)
        {
          const newGameState = { ...gameState };
          newGameState.board = structuredClone(board);
          newGameState.holdPieces = structuredClone(holdPieces);
          setGameHistory([newGameState]);
          setMoveHistoryString(newGameState.moveHistoryString);
        }

        setIsEditMode(false);
        break;
      case "SkipStart": // 最初の履歴へ
        if (gameHistory.length > 1) {
          const newGameState = gameHistory[0];
          setGameState(newGameState);
          setBoard(newGameState.board);
          setHoldPieces(newGameState.holdPieces);
          setCurrentPlayer(newGameState.currentPlayer);
          setHistoryIdx(0);
          setMoveHistoryString(newGameState.moveHistoryString);

          console.log("SRT", newGameState.moveHistoryString);
        }
        break;
      case "Rewind": // Undo
        if (historyIdx >= 1) {
          const newGameState = gameHistory[historyIdx - 1];
          setGameState(newGameState);
          setBoard(newGameState.board);
          setHoldPieces(newGameState.holdPieces);
          setCurrentPlayer(newGameState.currentPlayer);
          setHistoryIdx((prev) => prev - 1);
          setMoveHistoryString(newGameState.moveHistoryString);
          console.log("RWD", newGameState.moveHistoryString);
        }
        break;
      case "Play": // 履歴の自動再生をする
        // 未実装
        // 履歴の自動再生機能を実装する予定
        break;
      case "Pause": // 履歴の自動再生を停止する
        // 未実装
        // 履歴の自動再生を停止する機能を実装する予定
        break;
      case "Forward": // Redo
        if (historyIdx < gameHistory.length - 1) {
          const newGameState = gameHistory[historyIdx + 1];
          setGameState(newGameState);
          setBoard(newGameState.board);
          setHoldPieces(newGameState.holdPieces);
          setCurrentPlayer(newGameState.currentPlayer);
          setHistoryIdx((prev) => prev + 1);
          setMoveHistoryString(newGameState.moveHistoryString);
          console.log("FWD", newGameState.moveHistoryString);
        }
        break;
      case "SkipEnd": // 最後の履歴へ
        if (gameHistory.length > 1) {
          const newGameState = gameHistory[gameHistory.length - 1];
          setGameState(newGameState);
          setBoard(newGameState.board);
          setHoldPieces(newGameState.holdPieces);
          setCurrentPlayer(newGameState.currentPlayer);
          setHistoryIdx(gameHistory.length - 1);
          setMoveHistoryString(newGameState.moveHistoryString);
          console.log("END", newGameState.moveHistoryString);
        }
        break;
      default:
        break;
    }
  };

  /**
   * Calculates the valid movable cells for a selected piece and updates the state.
   *
   * @param {number} row - The row index of the selected piece.
   * @param {number} col - The column index of the selected piece.
   * @param {Piece} cell - The selected piece.
   */
  const calculateMovableCells = (row: number, col: number, cell: Piece) => {
    if (!cell || !cell.type) return;

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
    const targetCell = board[row][col];

    if (selectedHoldPiece) {
      const move = {
        srcCell: null,
        dstCell: { row: row, col: col, piece: targetCell },
        wantPromote: false,
        dropPiece: selectedHoldPiece,
      };
      pieceMove(move);
    } else if (selectedPiece) {
      if (selectedPiece.row === row && selectedPiece.col === col) {
        // cancel
        setSelectedPiece(null);
        setMovableCells([]);
        return;
      }
      const move = {
        srcCell: {
          ...selectedPiece,
          piece: board[selectedPiece.row][selectedPiece.col],
        },
        dstCell: { row: row, col: col, piece: targetCell },
        wantPromote: false,
        dropPiece: null,
      };
      pieceMove(move);
    } else if (targetCell) {
      if (isEditMode || (!isEditMode && targetCell.owner === currentPlayer)) {
        // Select a piece and calculate movable cells
        setSelectedPiece({ row: row, col: col });
        if (!isEditMode) calculateMovableCells(row, col, targetCell);
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
      if (selectedPiece.row === row && selectedPiece.col === col) {
        // cancel
        setSelectedPiece(null);
        setMovableCells([]);
        return;
      }
      const move = {
        srcCell: {
          ...selectedPiece,
          piece: board[selectedPiece.row][selectedPiece.col],
        },
        dstCell: {
          row: row,
          col: col,
          piece: board[row][col],
        },
        wantPromote: true,
        dropPiece: null,
      };
      pieceMove(move);
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

  /**
   * Adds a piece to the player's hold pieces.
   *
   * @param {GameState["holdPieces"]} holdPieces - The current hold pieces state.
   * @param {PlayerType} owner - The owner of the piece to add.
   * @param {PieceType | null} pieceType - The type of the piece to add.
   * @returns {GameState["holdPieces"]} The updated hold pieces state.
   */
  const addHoldPiece = (
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

  /**
   * Removes a piece from the player's hold pieces.
   *
   * @param {GameState["holdPieces"]} holdPieces - The current hold pieces state.
   * @param {PlayerType} owner - The owner of the piece to remove.
   * @param {PieceType} pieceType - The type of the piece to remove.
   * @returns {GameState["holdPieces"]} The updated hold pieces state.
   */
  const removeHoldPiece = (
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
   * Handles the click event on a piece in the hold pieces area, toggling the selection state.
   *
   * @param {Piece} cell - The piece in the hold pieces area that was clicked.
   */
  const handleHoldPieceClick = (cell: Piece) => {
    if (isEditMode) {
      if (selectedPiece) {
        const piece = board[selectedPiece.row][selectedPiece.col];
        if (!piece) {
          console.error("Logic error: piece is null at handleHoldPieceClick");
          setSelectedPiece(null);
          setMovableCells([]);
          return;
        }
        const newBoard = structuredClone(board);
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        const pieceOrgType = getOriginalPieceType(piece.type) || piece.type;
        setHoldPieces(addHoldPiece(holdPieces, cell.owner, pieceOrgType));
        setSelectedPiece(null);
        setMovableCells([]);
      } else if (selectedHoldPiece && selectedHoldPiece.owner !== cell.owner) {
        setHoldPieces(
          removeHoldPiece(
            addHoldPiece(holdPieces, cell.owner, selectedHoldPiece.type),
            selectedHoldPiece.owner,
            selectedHoldPiece.type
          )
        );
        setSelectedHoldPiece(null);
      } else {
        setSelectedHoldPiece(cell);
      }
    } else {
      if (selectedHoldPiece) {
        setSelectedHoldPiece(null);
      } else {
        if (cell.owner === currentPlayer) {
          setSelectedHoldPiece(cell);
        }
      }
    }
  };

  const handleNewKifu = (kifu: string) => {
    setKifu(kifu);
  };

  const handleLoadGame = () => {
    console.log("Load Game");
    const foobar: Record<string, PieceType> = {
      NN: PieceType.None,
      OU: PieceType.King1,
      HI: PieceType.Rook,
      KA: PieceType.Bishop,
      KI: PieceType.Gold,
      GI: PieceType.Silver,
      KE: PieceType.Knight,
      KY: PieceType.Lance,
      FU: PieceType.Pawn,
      RY: PieceType.PromotedRook,
      UM: PieceType.PromotedBishop,
      NG: PieceType.PromotedSilver,
      NK: PieceType.PromotedKnight,
      NY: PieceType.PromotedLance,
      TO: PieceType.PromotedPawn,
    };
    const board: (Piece | null)[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    const holdPieces: GameState["holdPieces"] = {
      [PlayerType.Black]: [],
      [PlayerType.White]: [],
    };
    const json = Parsers.parseKIF(kifu);
    if (json && json.initial && json.initial.data) {
      json.initial.data.board.map((rcol, rcolIndex) =>
        rcol.map((cell, rrowIndex) => {
          if (cell.color !== undefined) {
            const type = foobar[cell.kind ? cell.kind : "NN"] || PieceType.None;
            const owner =
              cell.color === 1 ? PlayerType.White : PlayerType.Black;
            const direction = cell.color === 1 ? DirType.Down : DirType.Up;
            board[rrowIndex][8 - rcolIndex] = { type, owner, direction };
          } else {
            board[rrowIndex][8 - rcolIndex] = null;
          }
        })
      );
      const hands0: [string, number][] = Object.entries(
        json.initial.data.hands[0]
      );
      const hands1: [string, number][] = Object.entries(
        json.initial.data.hands[1]
      );

      for (const kind in hands0) {
        const type = foobar[hands0[kind][0]];
        const count = hands0[kind][1];
        if (count)
          holdPieces[PlayerType.Black].push({ type: type, count: count });
      }
      for (const kind in hands1) {
        const type = foobar[hands1[kind][0]];
        const count = hands1[kind][1];
        if (count)
          holdPieces[PlayerType.White].push({ type: type, count: count });
      }
    }
    const currentPlayer = PlayerType.Black;
    const newGameState = {
      board,
      prevMove: null,
      moveHistoryString: null,
      holdPieces,
      currentPlayer,
    };
    setBoard(newGameState.board);
    setHoldPieces(newGameState.holdPieces);
    setCurrentPlayer(newGameState.currentPlayer);
    setHistoryIdx(0);
    setGameState(newGameState);
    setGameHistory([newGameState]);
    setMoveHistoryString(newGameState.moveHistoryString);
    prevDstPosition.row = -1;
    prevDstPosition.col = -1;
  };

  return (
    <>
      <Box>
        <Komadai
          holdPieces={holdPieces[PlayerType.White]}
          owner={PlayerType.White}
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
      <Box>
        <Komadai
          holdPieces={holdPieces[PlayerType.Black]}
          owner={PlayerType.Black}
          direction={DirType.Up}
          handleOnClick={handleHoldPieceClick}
          selectedHoldPiece={selectedHoldPiece}
        />
      </Box>
      <Controller
        isEditMode={isEditMode}
        canButton={canButton}
        handleControllerButton={handleControllerButton}
      />
      <DisplayMoveHistory moveHistory={moveHistoryString} />
      <DisplayKifu
        kifu={kifu}
        handleLoadGame={handleLoadGame}
        handleNewKifu={handleNewKifu}
      />
    </>
  );
};

export default Shogi;
