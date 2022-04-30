import { useState } from "react";
import Image from "next/image";
import { TokenImageProps } from "../../utils/interfaces/components";

const TokenImage = ({ symbol, w = 25, h = 25 }: TokenImageProps) => {
  const [imgSrc, setImgSrc] = useState(symbol);
  return (
    <Image
      src={`/tokens/${imgSrc.toUpperCase()}.png`}
      alt={imgSrc.toUpperCase()}
      width={w}
      height={h}
      loading="lazy"
      onError={() => {
        setImgSrc("DEFAULT");
      }}
    />
  );
};

export default TokenImage;
