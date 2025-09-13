import Table from "./Table";
import TablePagination from "./TablePagination";

export default function TableLayout({
  rows = [],
  headings = [],
  loading = false,
  pagination = null,
  sortBy,
  sortDir,
  onSort,
  onPerPageChange,
  tableClass = "",
  emptyClass = "",
  skeletonRows,
}) {
  return (
    <>
      <Table
        headings={headings}
        rows={rows}
        isLoading={loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={onSort}
        className={tableClass}
        emptyClass={emptyClass}
        skeletonRows={skeletonRows}
      />

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
