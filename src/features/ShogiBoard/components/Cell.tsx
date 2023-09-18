import { Image, Box } from "@chakra-ui/react";
import { Piece } from "../../../types/pieceTypes";
import { getImage } from "../../../utils/boardUtils";
import { BOARD_SIZE, PIECE_SIZE } from "../../../constants/constants";

interface CellProps {
  row: number;
  col: number;
  cell: Piece | null;
  handleCellClick: (row: number, col: number, cell: Piece | null) => void;
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
  const image = cell ? getImage(cell.type, cell.direction) : null;
  const pieceClassName = isSelected ? "selected-piece" : "";
  const cellClassName = isMovableCell ? "movable-cell" : "";

  return cell && cell.type !== undefined ? (
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
