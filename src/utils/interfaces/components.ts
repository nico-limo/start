import { FarmActions, OptionsActionsProps, TokenPortfolio } from "./index.";

export interface PagesLabel {
  id: string;
  label: string;
  path: string;
}

export interface MobileTopBarProps {
  isOpen: boolean;
  onModalOpen: () => void;
  onPurchaseOpen: () => void;
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

export interface FarmActionProps {
  actions: FarmActions;
  address: string;
  onClaim: () => void;
}

export interface TokenImageProps {
  symbol: string;
  w?: number;
  h?: number;
}

export interface TokenActionsProps {
  token: TokenPortfolio;
  isTokens: boolean;
}

export interface PopupActionsProps {
  isLoading: boolean;
  label: OptionsActionsProps;
  onAction: (action: string) => void;
  action: string;
}
