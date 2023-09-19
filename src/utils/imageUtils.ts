import { PIECES } from "../constants/constants";
import { DirType, PieceType } from "../types/pieceTypes";

/**
 * Retrieves the image URL for a given piece type and direction.
 *
 * @param {PieceType} type - The type of the piece.
 * @param {DirType} direction - The direction of the piece.
 * @returns {string} The URL of the image representing the piece.
 */
export const getImage = (type?: PieceType, direction?: DirType) => {
  const piece = PIECES.find((piece) => piece.type === type);
  return direction === DirType.Up ? piece?.UpImage : piece?.DownImage;
};
