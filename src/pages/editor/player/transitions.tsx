// Dummy implementations for build-only
export const fade = () => ({});
export const slide = ({ direction }: any) => {
  console.log(direction);
  return {};
};
export const wipe = ({ direction }: any) => {
  console.log(direction);
  return {};
};
export const flip = () => ({});
export const clockWipe = ({ width, height }: any) => {
  console.log(width, height);
  return {};
};
export const star = ({ width, height }: any) => {
  console.log(width, height);
  return {};
};
export const circle = ({ width, height }: any) => {
  console.log(width, height);
  return {};
};
export const rectangle = ({ width, height }: any) => {
  console.log(width, height);
  return {};
};
export const slidingDoors = ({ width, height }: any) => {
  console.log(width, height);
  return {};
};
export const linearTiming = ({ durationInFrames }: any) => {
  console.log(durationInFrames);
  return {};
};

export type SlideDirection = "left" | "right" | "up" | "down";

export const TransitionSeries = {
  Transition: ({ key, presentation, timing }: any) => {
    console.log(key, presentation, timing);
    return null; // or <></> if JSX is needed
  },
};
