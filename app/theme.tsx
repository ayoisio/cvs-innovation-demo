import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import "./firebaseConfig";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

export default theme;
