import { debounce } from "@mui/material";
import { useState } from "react";

export const useProductFilters = () => {
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const setInputSearch = debounce((value) => setSearch(value), 500);

  return { search, page, perPage, setInputSearch, setPage, setPerPage };
};
