/** Shared size tokens from Figma Input/Size (177:3464), applied to input variants. */
export const figmaInputSizes = {
  large: {
    height: "h-14",
    radius: "rounded-[15px]",
    padding: "px-3",
    text: "text-base leading-[26px]",
  },
  medium: {
    height: "h-12",
    radius: "rounded-[12px]",
    padding: "px-[10px]",
    text: "text-sm leading-[22px]",
  },
  small: {
    height: "h-10",
    radius: "rounded-[10px]",
    padding: "px-2",
    text: "text-sm leading-[22px]",
  },
};

export function getFigmaInputSize(size) {
  return figmaInputSizes[size] ?? figmaInputSizes.large;
}
