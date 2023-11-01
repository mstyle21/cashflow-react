import { Box } from "@mui/material";
import React, { SetStateAction } from "react";
import { Dropdown } from "react-bootstrap";

type MainCategoryFilterProps = {
  mainCategories: { [id: number]: string };
  activeCategory: number;
  setActiveCategory: React.Dispatch<SetStateAction<number>>;
};
const MainCategoryFilter = ({ mainCategories, activeCategory, setActiveCategory }: MainCategoryFilterProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="default" className="dc-filter-btn" style={{ width: "200px" }}>
        <span style={{ marginRight: "10px" }}>{mainCategories[activeCategory]}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        as="div"
        className="dc-filter-dd"
        align="end"
        style={{ maxHeight: "320px", overflow: "hidden", overflowY: "auto" }}
      >
        {Object.entries(mainCategories).map(([categId, categName], index) => (
          <Dropdown.Item
            key={index}
            as="div"
            active={Number(categId) === activeCategory}
            onClick={() => setActiveCategory(Number(categId))}
          >
            <Box className="dd-item-title text-center">{categName}</Box>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MainCategoryFilter;
