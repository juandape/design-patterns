import { JSX, ReactNode } from "react";

export interface Button{
  label: string;
  onClick: () => void;
}

export interface Card {
  title: string;
  children: ReactNode;
}

export interface UIButton {
  render(props: Button): JSX.Element;
}

export interface UICard {
  render(props: Card): JSX.Element;
}

export interface UIFactory {
  createButton(): UIButton;
  createCard(): UICard;
}

export type ThemeContextType = {
  factory: UIFactory;
  toggleTheme: () => void;
};