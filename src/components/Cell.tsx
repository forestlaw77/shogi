import { Image, Box } from "@chakra-ui/react";
import { PieceType, Piece } from "../types/pieceTypes";
import { PIECE_SIZE, BOARD_SIZE } from "../constants/constants";
import { getImage } from "../utils/boardUtils";

interface CellProps {
  row: number;
  col: number;
  cell: Piece;
  handleCellClick: (row: number, col: number, cell: Piece) => void;
  isSelected: boolean;
  isMovableCell: boolean;
}

/**
 * The `Cell` component represents an individual cell on the game board.
 *
 * @param {Object} props - The component's properties.
 * @param {number} props.row - The row index of the cell.
 * @param {number} props.col - The column index of the cell.
 * @param {Cell} props.cell - The cell's data, including its type and direction.
 * @param {function} props.handleCellClick - The click event handler for the cell.
 * @param {boolean} props.isSelected - Indicates if the cell is selected.
 * @param {boolean} props.isMovableCell - Indicates if the cell can be moved to.
 * @returns {JSX.Element} The rendered game board cell.
 */
const Cell: React.FC<CellProps> = (props) => {
  const { row, col, cell, handleCellClick, isSelected, isMovableCell } = props;
  const image = getImage(cell.type, cell.direction);
  const pieceClassName = isSelected ? "selected-piece" : "";
  const cellClassName = isMovableCell ? "movable-cell" : "";

  return cell.type !== PieceType.None ? (
    <Image
      src={`/images/${image}`}
      alt={cell.type}
      w={`${PIECE_SIZE.width}px`}
      h={`${PIECE_SIZE.height}px`}
      position="absolute"
      left={`${col * PIECE_SIZE.width + BOARD_SIZE.padding}px`}
      top={`${row * PIECE_SIZE.height + BOARD_SIZE.padding}px`}
      onClick={() => handleCellClick(row, col, cell)}
      className={`${pieceClassName} ${cellClassName}`}
    />
  ) : (
    <Box
      w={`${PIECE_SIZE.width}px`}
      h={`${PIECE_SIZE.height}px`}
      position="absolute"
      left={`${col * PIECE_SIZE.width + BOARD_SIZE.padding}px`}
      top={`${row * PIECE_SIZE.height + BOARD_SIZE.padding}px`}
      onClick={() => handleCellClick(row, col, cell)}
      className={`${pieceClassName} ${cellClassName}`}
    />
  );
};

export default Cell;
