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
} from "../../types/pieceTypes";
import {
  isMovable,
  getPromotedPieceType,
  isNifu,
  handleCellClick,
  getOriginalPieceType,
  canPromote,
  isSameDst,
  resetPrevDstPosition,
  removeHoldPiece,
  addHoldPiece,
} from "../../utils/boardUtils";
import { makeMovedMessage } from "../../utils/moveMessageBuilder";
import { calculateMovableCells } from "../../utils/moveCalculator";
import { loadGame } from "../../utils/gameLoader";
import Komadai from "../../components/ui/Komadai";
import Board from "../../components/ui/Board";
import BoardButtons from "../../components/ui/BoardButtons";
import DisplayMoveHistory from "../../components/ui/DisplayMoveHistory";
import DisplayKifu from "../../components/ui/DisplayKifu";
import { PLAYBACK_SPEED } from "../../constants/constants";

interface ShogiProps {
  initialGameState: GameState;
  mode: boolean;
  initialKifu: string;
  onBack: () => void;
}

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
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [movableCells, setMovableCells] = useState<number[][]>([]);
  const [selectedHoldPiece, setSelectedHoldPiece] = useState<Piece | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(mode);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [kifu, setKifu] = useState(initialKifu);
  const [canButton, setCanButton] = useState({
    rewind: false,
    foward: false,
    play: false,
    pause: false,
  });
  //const [isPlaying, setIsPlaying] = useState(false);
  const [playHistoryTimeoutID, setPlayHistoryTimeoutID] = useState(0);

  console.log("Shogi");
  console.log("historyIdx", historyIdx);

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
    const newGameState = structuredClone(gameState);

    if (dropPiece) {
      // Drop
      setSelectedHoldPiece(null);
      if (!dstCell.piece) {
        newGameState.board[dstCell.row][dstCell.col] = dropPiece;
        newGameState.holdPieces = removeHoldPiece(
          gameState.holdPieces,
          dropPiece.owner,
          dropPiece.type
        );
      }
    } else if (srcCell && srcCell.piece) {
      // Move
      if (wantPromote) {
        const promoted =
          getPromotedPieceType(srcCell.piece.type) || srcCell.piece.type;
        newGameState.board[dstCell.row][dstCell.col] = {
          ...srcCell.piece,
          type: promoted,
        };
      } else {
        newGameState.board[dstCell.row][dstCell.col] = srcCell.piece;
      }

      newGameState.board[srcCell.row][srcCell.col] = dstCell.piece;

      setSelectedPiece(null);
      setMovableCells([]);
    } else {
      console.error(
        "srcCell or srcCell.piece is null or undefined at editModeMove()"
      );
    }
    setGameState(newGameState);
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
    const newGameState = structuredClone(gameState);
    let isPromoted: boolean = false;

    if (dropPiece) {
      // drop
      setSelectedHoldPiece(null);
      if (dstCell.piece) {
        return null;
      }
      if (isNifu(dstCell.col, dropPiece, newGameState.board)) {
        alert("Two-pawn rule violation.");
        return null;
      }
    }

    if (dropPiece) {
      // drop
      newGameState.board[dstCell.row][dstCell.col] = dropPiece;
      newGameState.holdPieces = removeHoldPiece(
        gameState.holdPieces,
        dropPiece.owner,
        dropPiece.type
      );
    } else if (!srcCell || !srcCell.piece) {
      console.error("Logic error: srcCell & dropPiece is null at executeMove");
      return null;
    } else if (isMovable(dstCell.row, dstCell.col, movableCells)) {
      // move
      if (!canPromote(dstCell.row, srcCell.row, srcCell.piece)) {
        newGameState.board[dstCell.row][dstCell.col] = srcCell.piece;
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
          newGameState.board[dstCell.row][dstCell.col] = {
            ...srcCell.piece,
            type:
              getPromotedPieceType(srcCell.piece.type) || srcCell.piece.type,
          };
          isPromoted = true;
        } else {
          newGameState.board[dstCell.row][dstCell.col] = srcCell.piece;
        }
      }
      newGameState.board[srcCell.row][srcCell.col] = null;

      // get enemy piece
      if (dstCell.piece && dstCell.piece.owner !== gameState.currentPlayer) {
        const enemyPieceType =
          getOriginalPieceType(dstCell.piece.type) || dstCell.piece.type;
        newGameState.holdPieces = addHoldPiece(
          gameState.holdPieces,
          gameState.currentPlayer,
          enemyPieceType
        );
      }
      setSelectedPiece(null);
      setMovableCells([]);
    }

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

    newGameState.moveHistoryString = gameState.moveHistoryString
      ? makeMovedMessage(moved, gameState.currentPlayer) +
        "," +
        gameState.moveHistoryString
      : makeMovedMessage(moved, gameState.currentPlayer);
    newGameState.currentPlayer =
      gameState.currentPlayer === PlayerType.Black
        ? PlayerType.White
        : PlayerType.Black;
    return newGameState;
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

  /**
   * Switches the game mode to Play Mode.
   */
  const toGameMode = () => {
    gameState.currentPlayer = PlayerType.Black;
    setGameHistory([gameState]);
    setIsEditMode(false);
    setHistoryIdx(0);
  };

  /**
   * Switches the game mode to Edit Mode.
   */
  const toEditMode = () => {
    setIsEditMode(true);
  };

  /**
   * Moves to the beginning of the game history.
   */
  const playToStart = () => {
    if (gameHistory.length > 1) {
      const newGameState = gameHistory[0];
      setGameState(newGameState);
      setHistoryIdx(0);
    }
  };

  /**
   * Moves to the previous step in the game history.
   */
  const playToRewind = () => {
    if (historyIdx >= 1) {
      const newGameState = gameHistory[historyIdx - 1];
      setGameState(newGameState);
      setHistoryIdx((prev) => prev - 1);
    }
  };

  /**
   * Moves to the next step in the game history.
   */
  const playToFoward = () => {
    if (historyIdx < gameHistory.length - 1) {
      const newGameState = gameHistory[historyIdx + 1];
      setGameState(newGameState);
      setHistoryIdx((prev) => prev + 1);
    }
  };

  /**
   * Moves to the end of the game history.
   */
  const playToEnd = () => {
    if (gameHistory.length > 1) {
      const newGameState = gameHistory[gameHistory.length - 1];
      setGameState(newGameState);
      setHistoryIdx(gameHistory.length - 1);
    }
  };

  const playHistory = (idx: number) => {
    if (idx < gameHistory.length - 1) {
      idx++;
      const newGameState = gameHistory[idx];
      setHistoryIdx(idx);
      setGameState(newGameState);
      const timeoutID = setTimeout(() => playHistory(idx), PLAYBACK_SPEED);
      setPlayHistoryTimeoutID(timeoutID);
    } else {
      stopPlayHistory();
    }
  };

  const startPlayHistory = () => {
    console.log("startPlayHistory");
    playHistory(historyIdx);
  };

  const stopPlayHistory = () => {
    console.log("stopPlayHistory");
    clearTimeout(playHistoryTimeoutID);
    setPlayHistoryTimeoutID(0);
  };

  useEffect(() => {
    setCanButton({
      rewind: historyIdx >= 1 && gameHistory.length >= 1,
      foward: historyIdx < gameHistory.length - 1,
      play: !playHistoryTimeoutID && historyIdx < gameHistory.length - 1,
      pause: playHistoryTimeoutID !== 0,
    });
  }, [playHistoryTimeoutID, historyIdx, gameHistory.length]);

  /**
   * Handles button clicks on the game controller.
   *
   * @param {string} btn - The button identifier.
   */
  const handleControllerButton = (btn: string) => {
    switch (btn) {
      case "Back":
        onBack();
        break;
      case "Edit": // Edit Mode
        if (isEditMode) {
          toGameMode();
        } else {
          toEditMode();
        }
        break;
      case "SkipStart": // Move to the beginning of the history
        playToStart();
        break;
      case "Rewind": // Undo
        playToRewind();
        break;
      case "Play": // Auto-play history (Not implemented)
        startPlayHistory();
        break;
      case "Pause": // Stop auto-play (Not implemented)
        stopPlayHistory();
        break;
      case "Forward": // Redo
        playToFoward();
        break;
      case "SkipEnd": // Move to the end of the history
        playToEnd();
        break;
      default:
        break;
    }
  };

  /**
   * Handles the click event on a cell, including moving pieces and capturing opponent pieces.
   *
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  const singleClickFunc = (row: number, col: number) => {
    const targetCell = gameState.board[row][col];

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
          piece: gameState.board[selectedPiece.row][selectedPiece.col],
        },
        dstCell: { row: row, col: col, piece: targetCell },
        wantPromote: false,
        dropPiece: null,
      };
      pieceMove(move);
    } else if (targetCell) {
      if (
        isEditMode ||
        (!isEditMode && targetCell.owner === gameState.currentPlayer)
      ) {
        // Select a piece and calculate movable cells
        setSelectedPiece({ row: row, col: col });
        if (!isEditMode) {
          const movableCells = calculateMovableCells(
            row,
            col,
            targetCell,
            gameState.board
          );
          setMovableCells(movableCells);
        }
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
          piece: gameState.board[selectedPiece.row][selectedPiece.col],
        },
        dstCell: {
          row: row,
          col: col,
          piece: gameState.board[row][col],
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
   * Handles the click event on a piece in the hold pieces area, toggling the selection state.
   *
   * @param {Piece} cell - The piece in the hold pieces area that was clicked.
   */
  const handleHoldPieceClick = (cell: Piece) => {
    if (isEditMode) {
      if (selectedPiece) {
        const piece = gameState.board[selectedPiece.row][selectedPiece.col];
        if (!piece) {
          console.error("Logic error: piece is null at handleHoldPieceClick");
          setSelectedPiece(null);
          setMovableCells([]);
          return;
        }
        const newGameState = structuredClone(gameState);
        newGameState.board[selectedPiece.row][selectedPiece.col] = null;
        const pieceOrgType = getOriginalPieceType(piece.type) || piece.type;
        newGameState.holdPieces = addHoldPiece(
          gameState.holdPieces,
          cell.owner,
          pieceOrgType
        );
        setGameState(newGameState);
        setSelectedPiece(null);
        setMovableCells([]);
      } else if (selectedHoldPiece && selectedHoldPiece.owner !== cell.owner) {
        const newGameState = structuredClone(gameState);
        newGameState.holdPieces = removeHoldPiece(
          addHoldPiece(
            gameState.holdPieces,
            cell.owner,
            selectedHoldPiece.type
          ),
          selectedHoldPiece.owner,
          selectedHoldPiece.type
        );
        setGameState(newGameState);
        setSelectedHoldPiece(null);
      } else {
        setSelectedHoldPiece(cell);
      }
    } else {
      if (selectedHoldPiece) {
        setSelectedHoldPiece(null);
      } else {
        if (cell.owner === gameState.currentPlayer) {
          setSelectedHoldPiece(cell);
        }
      }
    }
  };

  const handleNewKifu = (kifu: string) => {
    setKifu(kifu);
  };

  const handleLoadGame = () => {
    const newGameState = loadGame(kifu);
    setGameState(newGameState);
    setGameHistory([newGameState]);
    setHistoryIdx(0);
    resetPrevDstPosition();
  };

  return (
    <>
      <Box>
        <Komadai
          holdPieces={gameState.holdPieces[PlayerType.White]}
          owner={PlayerType.White}
          direction={DirType.Down}
          handleOnClick={handleHoldPieceClick}
          selectedHoldPiece={selectedHoldPiece}
        />
      </Box>
      <Board
        board={gameState.board}
        handleCellClick={handleFrontCellClick}
        selectedPiece={selectedPiece}
        movableCells={movableCells}
      />
      <Box>
        <Komadai
          holdPieces={gameState.holdPieces[PlayerType.Black]}
          owner={PlayerType.Black}
          direction={DirType.Up}
          handleOnClick={handleHoldPieceClick}
          selectedHoldPiece={selectedHoldPiece}
        />
      </Box>
      <BoardButtons
        isEditMode={isEditMode}
        canButton={canButton}
        handleControllerButton={handleControllerButton}
      />
      <DisplayMoveHistory moveHistory={gameState.moveHistoryString} />
      <DisplayKifu
        kifu={kifu}
        handleLoadGame={handleLoadGame}
        handleNewKifu={handleNewKifu}
      />
    </>
  );
};

export default Shogi;
