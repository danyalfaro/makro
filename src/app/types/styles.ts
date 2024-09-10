export enum STYLE {
  MINIMALISM = 'MINIMALISM',
  NEUMORPHISM = 'NEUMORPHISM',
  NEUBRUTALISM = 'NEUBRUTALISM',
  GLASSMORPHISM = 'GLASSMORPHISM',
}

export const styleDisplayMap: { [key in STYLE]: string } = {
  [STYLE.MINIMALISM]: 'minimalism',
  [STYLE.NEUMORPHISM]: 'neumorphism',
  [STYLE.NEUBRUTALISM]: 'neubrutalism',
  [STYLE.GLASSMORPHISM]: 'glassmorphism',
}
