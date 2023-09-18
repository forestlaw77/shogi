import { useState } from "react";
import KifuList from "./KifuList";
import KifuPlay from "./KifuPlay";

const KifuPlayer: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const [kifu, setKifu] = useState<string | null>(null);

  const onBack = () => {
    console.log("onBack");
    setKifu(null);
  };

  const getKifu = (kifu: string | null) => {
    setKifu(kifu);
  };

  return (
    <>
      {kifu ? (
        <KifuPlay kifu={kifu} onBack={onBack} />
      ) : (
        <KifuList setKifu={getKifu} onEnd={onEnd} />
      )}
    </>
  );
};

export default KifuPlayer;
