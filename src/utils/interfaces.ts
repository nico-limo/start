export interface PagesLabel {
  id: string;
  label: string;
  path: string;
}

export interface MobileTopBar {
  isOpen: boolean;
  onClose: () => void;
}
