import { HStack, Image, Box, Flex, Text } from "@chakra-ui/react";
import {
  DirType,
  HoldPiece,
  Piece,
  PieceType,
  PlayerType,
} from "../../types/pieceTypes";
import { PIECE_SIZE } from "../../constants/constants";
import { getImage } from "../../utils/imageUtils";

interface KomadaiProps {
  holdPieces: HoldPiece[];
  owner: PlayerType.Black | PlayerType.White;
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
const Komadai: React.FC<KomadaiProps> = ({
  holdPieces,
  owner,
  direction,
  handleOnClick,
  selectedHoldPiece,
}) => {
  // If holdPieces is null or empty, return null to display nothing
  //if (holdPieces.length <= 0) return;

  const flexDirection = direction === DirType.Down ? "row-reverse" : "row";
  const alignSelf = direction === DirType.Down ? "end" : "baseline";
  const spaceCount = 8 - holdPieces.length;

  const HoldPieces: React.FC<{ holdPieces: HoldPiece[] }> = ({
    holdPieces,
  }) => {
    return (
      <>
        {holdPieces.map((piece) => {
          const image = getImage(piece.type, direction);
          const pieceClassName =
            selectedHoldPiece &&
            selectedHoldPiece.type === piece.type &&
            selectedHoldPiece.owner === owner
              ? "selected-piece"
              : "";
          return (
            <Box key={piece.type}>
              <Image
                margin="0px"
                src={`/images/${image}`}
                alt={`${piece.type}_${direction}`}
                w={`${PIECE_SIZE.width}px`}
                h={`${PIECE_SIZE.height}px`}
                onClick={() =>
                  handleOnClick({
                    type: piece.type,
                    owner: owner,
                    direction: direction,
                  })
                }
                className={`${pieceClassName}`}
              />
              <Text fontSize="xx-small">({piece.count})</Text>
            </Box>
          );
        })}
      </>
    );
  };

  const EmptyBox: React.FC<{
    num: number;
    owner: PlayerType;
    handleOnClick: (cell: Piece) => void;
  }> = ({ num, handleOnClick }) => {
    return (
      <>
        {Array.from({ length: num }, () => {
          const uniqueKey = crypto.randomUUID();
          return (
            <Box
              key={uniqueKey}
              margin="0px"
              w={`${PIECE_SIZE.width}px`}
              h={`${PIECE_SIZE.height + 10}px`}
              onClick={() =>
                handleOnClick({
                  type: PieceType.None,
                  owner: owner,
                  direction: DirType.None,
                })
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <Flex>
      <HStack
        alignSelf={alignSelf}
        flexDirection={flexDirection}
        wrap="wrap"
        bg="papayawhip"
        w="375px"
      >
        <HoldPieces holdPieces={holdPieces} />
        <EmptyBox
          num={spaceCount}
          owner={owner}
          handleOnClick={handleOnClick}
        />
      </HStack>
    </Flex>
  );
};
export default Komadai;
