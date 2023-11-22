import { Pagination } from "react-bootstrap";

type PaginatorProps = {
  page: number;
  pages: number;
  handlePageChange: (nr: number) => void;
};

const Paginator = ({ page, pages, handlePageChange }: PaginatorProps) => {
  const paginationItems = [];
  const paginationRange = 2;
  if (pages > 1) {
    for (let nr = 2; nr < pages; nr++) {
      if (nr >= page - paginationRange && nr <= page + paginationRange) {
        paginationItems.push(
          <Pagination.Item key={nr} active={nr === page} onClick={() => handlePageChange(nr)}>
            {nr}
          </Pagination.Item>
        );
      }
    }
  }

  return (
    <Pagination style={{ gap: "10px" }}>
      {page > 1 && (
        <>
          <Pagination.Prev onClick={() => handlePageChange(page - 1)} />
        </>
      )}
      <Pagination.Item active={page === 1} onClick={() => handlePageChange(1)}>
        1
      </Pagination.Item>
      {page > 2 + paginationRange && <Pagination.Ellipsis disabled />}
      {paginationItems}
      {page < pages - paginationRange - 1 && <Pagination.Ellipsis disabled />}
      {pages > 1 && (
        <Pagination.Item active={page === pages} onClick={() => handlePageChange(pages)}>
          {pages}
        </Pagination.Item>
      )}
      {page < pages && (
        <>
          <Pagination.Next onClick={() => handlePageChange(page + 1)} />
        </>
      )}
    </Pagination>
  );
};

export default Paginator;
