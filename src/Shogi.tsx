import { useState } from "react";
import { VStack, Box, Image, SimpleGrid, Button } from "@chakra-ui/react";
import ShogiGame from "./features/shogiGame/components/ShogiGame";
import KifuPlayer from "./features/kifuPlayer/components/KifuPlayer";
import TsumeShogi from "./features/tsumeShogi/components/TsumeShogi";

const Shogi = () => {
  const [gameType, setGameType] = useState(0);

  const handleClick = (type: number) => {
    setGameType(type);
  };

  return (
    <VStack>
      {gameType ? (
        gameType === 1 ? (
          <ShogiGame />
        ) : gameType === 4 ? (
          <KifuPlayer />
        ) : (
          <TsumeShogi />
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
            <Button size="lg">一人将棋</Button>
            <Button size="lg">ＡＩ対戦</Button>

            <Button size="lg">通信対戦</Button>

            <Button size="lg">棋譜再生</Button>

            <Button size="lg" onClick={() => handleClick(4)}>
              詰め将棋
            </Button>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default Shogi;
