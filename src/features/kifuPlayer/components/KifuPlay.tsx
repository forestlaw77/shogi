import {
  DirType,
  GameState,
  Piece,
  PieceType,
  PlayerType,
} from "../../../types/pieceTypes";
import ShogiGame from "../../shogiGame/components/ShogiGame";
import { Parsers } from "json-kifu-format";

const KifuPlay: React.FC<{ kifu: string; onBack: () => void }> = ({
  kifu,
  onBack,
}) => {
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
          const owner = cell.color === 1 ? PlayerType.White : PlayerType.Black;
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
  const initialGameState = {
    board,
    prevMove: null,
    moveHistoryString: null,
    holdPieces,
    currentPlayer,
  };

  return (
    <>
      <ShogiGame
        initialGameState={initialGameState}
        mode={false}
        initialKifu={kifu}
        onBack={onBack}
      />
    </>
  );
};
export default KifuPlay;
