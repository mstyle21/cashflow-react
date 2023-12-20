import { useEffect, useState } from "react";
import { TApiCategory } from "../../../types";

export const useCategory = (itemToEdit: TApiCategory | null) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(0);

  console.log(itemToEdit);
  useEffect(() => {
    setName(itemToEdit ? itemToEdit.name : "");
    setParentId(itemToEdit && itemToEdit.parent ? itemToEdit.parent.id : 0);
  }, [itemToEdit]);

  const resetValues = () => {
    setName("");
    setParentId(0);
  };

  return { name, parentId, setName, setParentId, resetValues };
};
