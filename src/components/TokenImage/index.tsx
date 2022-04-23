import { useState } from "react";
import Image from "next/image";
import { TokenImageProps } from "../../utils/interfaces/components";

const TokenImage = ({ symbol, w = 25, h = 25 }: TokenImageProps) => {
  const [imgSrc, setImgSrc] = useState(symbol);
  return (
    <Image
      src={`/tokens/${imgSrc}.png`}
      alt={imgSrc}
      width={w}
      height={h}
      loading="lazy"
      onError={() => {
        setImgSrc("default");
      }}
    />
  );
};

export default TokenImage;
