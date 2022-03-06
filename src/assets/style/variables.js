import styled from "styled-components";

export const colors = {
  softBlue: "hsl(215, 51%, 70%)",
  cyan: "hsl(178, 100%, 50%)",
  cyanHover: "hsl(178, 100%, 50%,0.5)",

  darkBlueCardBG: "hsl(216, 50%, 16%)",
  darkBlueLine: "hsl(215, 32%, 27%)",
  White: "hsl(0, 0%, 100%)",
  black: "rgba(0,10, 10, 0.9)",
  gray: "rgba(255,255,255,0.5)",
  hoverColor: "rgba(59, 59, 59, 0.61)"

};

export const responsiveWidths = {
  mabile: "375px",
};

export const fontSize = {
  large: "22px",
  medium: "16px",
  small: "14px",
  xlarge: "25px",
};
export const fontWidth = {
  light: 300,
  regular: 400,
  semiBold: 600,
  bold: 800,
};

export const borderRadius = {
  primary: "8px",
};

export const Flex = styled.div`
  display: flex;
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify || "space-between"};
  flex-direction: ${(props) => props.direction || "row"};
  height: ${({ height }) => height};
  gap: ${(props) => props.gap || "5px"};
`;
