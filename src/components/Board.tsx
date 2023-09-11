import { Box, Image } from "@chakra-ui/react";
import { BOARD_SIZE } from "../constants/constants";
import { Piece } from "../types/pieceTypes";
import RenderCell from "./Cell";
import { isMovable } from "../utils/boardUtils";

interface BoardProps {
  board: Piece[][];
  handleCellClick: (row: number, col: number, cell: Piece) => void;
  selectedPiece: { row: number; col: number } | null;
  movableCells: number[][];
}

/**
 * The `Board` component displays the entire game board, including all its cells.
 *
 * @param {Object} props - The component's properties.
 * @param {Cell[][]} props.board - The 2D array representing the game board.
 * @param {function} props.handleCellClick - The click event handler for individual cells.
 * @param {Object|null} props.selectedPiece - Information about the selected piece (if any).
 * @param {number[][]} props.movableCells - The coordinates of cells that can be moved to.
 * @returns {JSX.Element} The rendered game board.
 */
const Board: React.FC<BoardProps> = ({
  board,
  handleCellClick,
  selectedPiece,
  movableCells,
}) => {
  /**
   * Renders the cells of the game board.
   *
   * @returns {JSX.Element[]} An array of cell elements.
   */
  const renderCells = () => {
    return board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const isSelected =
          selectedPiece &&
          selectedPiece.row === rowIndex &&
          selectedPiece.col === colIndex
            ? true
            : false;
        const isMovableCell = isMovable(rowIndex, colIndex, movableCells);
        return (
          <RenderCell
            key={colIndex}
            row={rowIndex}
            col={colIndex}
            cell={cell}
            handleCellClick={handleCellClick}
            isSelected={isSelected}
            isMovableCell={isMovableCell}
          />
        );
      })
    );
  };

  return (
    <Box textAlign="center" fontSize="xl" position="relative">
      <Image
        src="/images/japanese-chess-b02.jpg"
        alt="Shogi Board"
        w={`${BOARD_SIZE.padding * 2 + BOARD_SIZE.width}px`}
        h={`${BOARD_SIZE.padding * 2 + BOARD_SIZE.height}px`}
      />
      {renderCells()}
    </Box>
  );
};

export default Board;
