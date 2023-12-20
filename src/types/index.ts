export type ApiCategory = {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  } | null;
  childs: ApiCategory[];
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
export type ApiExpenditure = {
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
export type ApiProduct = {
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
export type ApiPaginatedResponse<T> = {
  items: T[];
  count: number;
  pages: number;
};
export type ApiCity = {
  id: number;
  name: string;
};
export type ApiCompany = {
  id: number;
  name: string;
  keywords: string;
};
export type ApiExpenditureItem = {
  id: number;
  expenditure: ApiExpenditure;
  product: ApiProduct;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  category: {
    id: number;
    name: string;
    parent: {
      id: number;
      name: string;
    };
  };
};
export type UserStatsFilters = {
  month: string;
  year: string;
  type: "allTime" | "month" | "year";
};
