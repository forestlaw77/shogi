import { useState } from "react";
import KifuList from "./KifuList";
import KifuPlay from "./KifuPlay";

const KifuPlayer = () => {
  const [kifu, setKifu] = useState<string | null>(null);

  const onEnd = () => {
    setKifu(null);
  };

  const getKifu = (kifu: string | null) => {
    setKifu(kifu);
  };

  return (
    <>
      {kifu ? (
        <KifuPlay kifu={kifu} onEnd={onEnd} />
      ) : (
        <KifuList setKifu={getKifu} />
      )}
    </>
  );
};

export default KifuPlayer;
