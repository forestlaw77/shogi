import { HStack, Image, Box, Flex, Text } from "@chakra-ui/react";
import { DirType, PieceType, Piece } from "../types/pieceTypes";
import { PIECE_SIZE } from "../constants/constants";
import { getImage } from "../utils/boardUtils";

interface HoldPiecesProps {
  holdPieces: Piece[];
  direction: DirType;
  handleOnClick: (cell: Piece) => void;
  selectedHoldPiece: Piece | null;
}

/**
 * Component to display hold pieces for a specific direction.
 *
 * @param {Object} props - The component props.
 * @param {Piece[]} props.holdPieces - An array of hold pieces to display.
 * @param {DirType} props.direction - The direction (Up or Down) for which to display hold pieces.
 * @returns {JSX.Element|null} The HoldPieces component.
 */
const HoldPieces: React.FC<HoldPiecesProps> = ({
  holdPieces,
  direction,
  handleOnClick,
  selectedHoldPiece,
}) => {
  // If holdPieces is null or empty, return null to display nothing
  if (holdPieces.length <= 0) return;

  // Determine the flex direction and align self based on the direction
  const filteredHoldPieces = holdPieces.filter(
    (cell) => cell.direction === direction
  );

  if (filteredHoldPieces.length === 0) {
    return null;
  }

  const flexDirection = direction === DirType.Down ? "row-reverse" : "row";
  const alignSelf = direction === DirType.Down ? "end" : "baseline";

  return (
    <Flex>
      <HStack
        alignSelf={alignSelf}
        flexDirection={flexDirection}
        wrap="wrap"
        bg="papayawhip"
        w="375px"
      >
        {Object.values(PieceType).map((pieceType) => {
          const pieceCount = filteredHoldPieces.filter(
            (piece) => piece.type === pieceType
          ).length;
          const image = getImage(pieceType, direction);

          if (pieceCount <= 0) {
            return;
          }

          const pieceClassName =
            selectedHoldPiece && selectedHoldPiece.type === pieceType
              ? "selected-piece"
              : "";

          return (
            <Box key={pieceType}>
              <Image
                margin="0px"
                src={`/images/${image}`}
                alt={`${pieceType}_${direction}`}
                w={`${PIECE_SIZE.width}px`}
                h={`${PIECE_SIZE.height}px`}
                onClick={() =>
                  handleOnClick({
                    type: pieceType,
                    direction: direction,
                  })
                }
                className={`${pieceClassName}`}
              />
              <Text>({pieceCount})</Text>
            </Box>
          );
        })}
      </HStack>
    </Flex>
  );
};
export default HoldPieces;
