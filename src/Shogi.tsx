import { useState } from "react";
import { VStack, Box, Image, SimpleGrid, Button } from "@chakra-ui/react";
import ShogiGame from "./features/shogiGame/components/ShogiGame";
import KifuPlayer from "./features/kifuPlayer/components/KifuPlayer";
//import TsumeShogi from "./features/tsumeShogi/components/TsumeShogi";
import { generateInitialBoard } from "./utils/boardUtils";
import { PieceType, DirType, Piece } from "./types/pieceTypes";
//import { PIECES } from "./constants/constants";

const Shogi = () => {
  const [gameType, setGameType] = useState(0);

  const handleClick = (type: number) => {
    setGameType(type);
  };

  const generateAllPieces = () => {
    const pieces: Piece[] = [];

    pieces.push({ type: PieceType.King1, direction: DirType.Up });
    pieces.push({ type: PieceType.King2, direction: DirType.Down });

    [DirType.Up, DirType.Down].forEach((_) => {
      for (let i = 0; i < 9; i++) {
        pieces.push({ type: PieceType.Pawn, direction: _ });
      }
      for (let i = 0; i < 2; i++) {
        pieces.push({ type: PieceType.Gold, direction: _ });
        pieces.push({ type: PieceType.Silver, direction: _ });
        pieces.push({ type: PieceType.Knight, direction: _ });
        pieces.push({ type: PieceType.Lance, direction: _ });
      }
      pieces.push({ type: PieceType.Bishop, direction: _ });
      pieces.push({ type: PieceType.Rook, direction: _ });
    });

    return pieces;
  };

  const getAllEmptyBoard = () => {
    const emptyCell = {
      type: PieceType.None,
      direction: DirType.None,
      canPromote: false,
    };

    const board: Piece[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill({ ...emptyCell }));

    return board;
  };

  return (
    <VStack>
      {gameType ? (
        gameType === 1 ? (
          <ShogiGame
            initialBoard={generateInitialBoard()}
            initialHoldPieces={[]}
            isFreeMode={false}
          />
        ) : gameType === 4 ? (
          <KifuPlayer />
        ) : (
          <ShogiGame
            initialBoard={getAllEmptyBoard()}
            initialHoldPieces={generateAllPieces()}
            isFreeMode={true}
          />
        )
      ) : (
        <Box position="relative">
          <Image src="/images/japanese-chess-01.jpg" alt="Shogi Board" />
          <SimpleGrid
            columns={2}
            spacing={10}
            position="absolute"
            top="50%" /* 上端を中央に配置 */
            left="50%" /* 左端を中央に配置 */
            transform="translate(-50%, -50%)" /* 中央揃え */
            bgColor="rgb(255, 255, 255, 0.5)"
            boxSize="300"
          >
            <Button size="lg" onClick={() => handleClick(1)}>
              一人将棋
            </Button>
            <Button size="lg">ＡＩ対戦</Button>

            <Button size="lg">通信対戦</Button>

            <Button size="lg">棋譜再生</Button>

            <Button size="lg" onClick={() => handleClick(4)}>
              詰め将棋
            </Button>
            <Button size="lg" onClick={() => handleClick(5)}>
              練習将棋
            </Button>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default Shogi;
