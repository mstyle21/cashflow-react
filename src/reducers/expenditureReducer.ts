import { ExpenditureListItem, ELReducerAction, TExpenditureImage, EIReducerAction } from "../types";

export const expenditureListReducer = (state: ExpenditureListItem[], action: ELReducerAction) => {
  switch (action.type) {
    case "add_item":
      return [...state, action.payload];
    case "edit_item":
      if (state.find((item) => item.hash === action.payload.hash)) {
        return state.map((item) => {
          return item.hash === action.payload.hash ? action.payload : item;
        });
      } else {
        return [...state, action.payload];
      }
    case "delete_item":
      return state.filter((item) => item.hash !== action.payload.hash);
    case "reset":
      return [];
    case "add_items":
      return [...state, ...action.payload];
    default:
      return state;
  }
};

export const expenditureImagesReducer = (state: TExpenditureImage[], action: EIReducerAction) => {
  switch (action.type) {
    case "add_item":
      if (Array.isArray(action.payload)) {
        return [...state, ...action.payload];
      } else {
        return [...state, action.payload];
      }
    case "delete_item":
      return state.filter((item) => item.hash !== action.payload.hash);
    case "reset":
      return [];
    case "add_items":
      return [...state, ...action.payload];
    default:
      return state;
  }
};
