export type TApiCategory = {
  id: number;
  name: string;
  created: string;
  updated: string;
  parent: {
    id: number;
    name: string;
  } | null;
  childs: TApiCategory[];
};
export type TEditableExpenditure = {
  id: number;
  generalDetails: TExpenditureDetails;
  items: ExpenditureListItem[];
  images: TExpenditureImage[];
};
export type TExpenditureDetails = {
  date: Date | null;
  totalPrice: number | "";
  company: string | null;
  location: number | null;
  settlement: "none" | "total" | "partial";
};
export type ExpenditureListItem = {
  hash: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  category: number;
};
export type ELReducerAction =
  | {
      type: "add_item" | "edit_item" | "delete_item";
      payload: ExpenditureListItem;
    }
  | { type: "reset" }
  | { type: "add_items"; payload: ExpenditureListItem[] };
export type TExpenditureImage = {
  hash: string;
  path: string;
  expenditureId?: number;
  file?: File;
};
export type EIReducerAction =
  | {
      type: "add_item";
      payload: TExpenditureImage | TExpenditureImage[];
    }
  | {
      type: "delete_item";
      payload: TExpenditureImage;
    }
  | { type: "reset" }
  | { type: "add_items"; payload: TExpenditureImage[] };
export type TApiExpenditure = {
  id: number;
  company: {
    name: string;
  };
  purchaseDate: string;
  totalPrice: number;
  items: {
    id: number;
    category: {
      id: number;
      name: string;
    };
    product: {
      id: number;
      name: string;
      description: string;
    };
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
  }[];
  images: {
    id: number;
    path: string;
  }[];
};
export type TApiProduct = {
  id: number;
  name: string;
  description: string;
  expenditureItems: {
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    expenditure: {
      purchaseDate: string;
    };
  }[];
};
export type TApiProductResponse = {
  items: TApiProduct[];
  count: number;
  pages: number;
};
