import { Button } from "@chakra-ui/react";
import { KifuLite } from "kifu-for-js";

const KifuPlay: React.FC<{ kifu: string; onEnd: () => void }> = ({
  kifu,
  onEnd,
}) => {
  return (
    <>
      <KifuLite src={kifu}></KifuLite>
      <Button onClick={onEnd}>戻る</Button>
    </>
  );
};
export default KifuPlay;
