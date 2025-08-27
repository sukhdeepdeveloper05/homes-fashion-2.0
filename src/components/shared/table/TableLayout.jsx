import Table from "./Table";
import TablePagination from "./TablePagination";

export default function TableLayout({
  pagination = null,
  onPerPageChange,
  loading,
  ...rest
}) {
  return (
    <>
      <Table isLoading={loading} {...rest} />

      {pagination && (
        <TablePagination
          totalRecords={pagination.total}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          onPerPageChange={onPerPageChange}
          showPerPage={pagination.showPerPage}
          isLoading={loading}
        />
      )}
    </>
  );
}
