import { KifuLite } from "kifu-for-js";

const TsumeShogi = () => {
  return (
    <KifuLite
      src={"/kifu/everyday_20230909.kif"}
      tsume={{ hideAnswer: true }}
    ></KifuLite>
  );
};

export default TsumeShogi;
