export interface PagesLabel {
  id: string;
  label: string;
  path: string;
}

export interface MobileTopBar {
  isOpen: boolean;
  onModalOpen: () => void;
  onClose: () => void;
}

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ItemSelection {
  id: string;
  label: string;
}

export interface ModalRowProps {
  type: string;
  list: ItemSelection[];
  onSelect: (value: ItemSelection) => void;
  selectedItem: ItemSelection;
}
