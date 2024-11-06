import { useColorMode } from "@chakra-ui/react";
import Image from "@/components/Image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AnswerProps = {
  content?: string;
  image?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const Answer = ({ content, image, children, style }: AnswerProps) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <div className="flex" style={style}>
      <div className="shrink-0 mr-4">
        <Image
          className="w-8 opacity-100"
          src={isDarkMode ? "/images/logo-light.png" : "/images/logo-dark.png"}
          width={32}
          height={32}
          alt=""
        />
      </div>
      <div className="grow self-center">
        <div className="text-body-1m space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a className="text-blue-500 hover:underline" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Answer;
