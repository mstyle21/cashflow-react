type PaginatorInfoProps = {
  page: number;
  perPage: number;
  count: number;
};

const PaginatorInfo = ({ page, perPage, count }: PaginatorInfoProps) => {
  const from = count > 0 ? (page - 1) * perPage + 1 : count;
  const to = page * perPage < count ? page * perPage : count;

  return (
    <p>
      Showing {from} to {to} of {count} entries
    </p>
  );
};

export default PaginatorInfo;
