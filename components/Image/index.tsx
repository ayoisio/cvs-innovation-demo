import { useState } from "react";
import { default as NextImage, ImageProps } from "next/image";

interface CustomImageProps extends ImageProps {
  padding?: string;
}

const Image = ({ className, padding, ...props }: CustomImageProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <div style={{ padding: padding || "0" }}>
      <NextImage
        className={`inline-block align-top opacity-0 transition-opacity ${
          loaded ? "opacity-100" : ""
        } ${className || ""}`}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default Image;
