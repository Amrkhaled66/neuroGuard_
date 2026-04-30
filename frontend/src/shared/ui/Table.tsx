import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import type { TableColumn, TableStyles } from "react-data-table-component";
import { useMemo } from "react";
import { useTheme } from "@/shared/theme/themeContext";

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];

  loading?: boolean;
  noDataText?: string;

  pagination?: boolean;
  paginationPerPage?: number;
  totalRows?: number;
  paginationServer?: boolean;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (
    currentRowsPerPage: number,
    currentPage: number,
  ) => void;

  className?: string;
};

function getCustomStyles(isDark: boolean): TableStyles {
  const palette = isDark
    ? {
        tableBg: "rgba(10, 18, 15, 0.82)",
        headerBg: "rgba(17, 28, 25, 0.9)",
        rowBg: "rgba(10, 18, 15, 0.72)",
        rowHoverBg: "rgba(0, 0, 0, 0)",
        border: "rgba(130, 215, 177, 0.12)",
        textPrimary: "#EEF7F3",
        textSecondary: "#B5C6BF",
        noData: "#8EA29A",
      }
    : {
        tableBg: "#FFFFFF",
        headerBg: "#FFF",
        rowBg: "#FFFFFF",
        rowHoverBg: "#FAFAFA",
        border: "#ECECEC",
        textPrimary: "#374151",
        textSecondary: "#4B5563",
        noData: "#6B7280",
      };

  return {
    table: {
      style: {
        backgroundColor: palette.tableBg,
        // minWidth: "820px",
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        overflow: "hidden",
      },
    },
    headRow: {
      style: {
        minHeight: "72px",
        backgroundColor: palette.headerBg,
        borderBottom: `1px solid ${palette.border}`,
      },
    },
    headCells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        color: palette.textSecondary,
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      },
    },
    rows: {
      style: {
        minHeight: "80px",
        backgroundColor: palette.rowBg,
        // borderBottom: `1px solid ${palette.border}`,
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: palette.rowHoverBg,
          cursor: "pointer",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "16px",
        paddingBottom: "16px",
        fontSize: "15px",
        color: palette.textPrimary,
        alignItems: "center",
      },
    },
    pagination: {
      style: {
        minHeight: "72px",
        borderTop: `1px solid ${palette.border}`,
        backgroundColor: palette.tableBg,
        paddingLeft: "20px",
        paddingRight: "20px",
        fontSize: "14px",
        color: palette.textSecondary,
      },
      pageButtonsStyle: {
        borderRadius: "9999px",
        height: "40px",
        width: "40px",
        padding: 0,
        margin: "0 4px",
        cursor: "pointer",
        backgroundColor: "transparent",
        color: palette.textSecondary,
        fill: palette.textSecondary,
        transition: "all 0.2s ease",
        "&:disabled": {
          opacity: 0.4,
          cursor: "not-allowed",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: palette.rowHoverBg,
        },
      },
    },
    noData: {
      style: {
        padding: "48px 24px",
        color: palette.noData,
        fontSize: "14px",
      },
    },
    progress: {
      style: {
        padding: "24px",
        backgroundColor: palette.tableBg,
      },
    },
  };
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  noDataText = "No data available",
  pagination = false,
  paginationPerPage = 5,
  totalRows,
  paginationServer = false,
  onPageChange,
  onRowsPerPageChange,
  className = "",
}: TableProps<T>) {
  const { isDark } = useTheme();
  const customStyles = useMemo(() => getCustomStyles(isDark), [isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={[
        "!rounded-3xl",
        className,
      ].join(" ")}
    >
      <div className="overflow-x-auto">
        <DataTable<T>
          columns={columns}
          data={data}
          responsive
          highlightOnHover={!isDark}
          pointerOnHover
          progressPending={loading}
          pagination={pagination}
          paginationServer={paginationServer}
          paginationTotalRows={totalRows}
          paginationPerPage={paginationPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          onChangePage={onPageChange}
          onChangeRowsPerPage={onRowsPerPageChange}
          noDataComponent={
            !loading ? (
              <div className="py-14 text-center">
                <p className="text-sm font-medium app-text-primary">
                  {noDataText}
                </p>
                <p className="app-text-secondary mt-1 text-sm">
                  Try adjusting your filters or search
                </p>
              </div>
            ) : null
          }
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page",
            rangeSeparatorText: "of",
            noRowsPerPage: false,
          }}
          customStyles={customStyles}
        />
      </div>
    </motion.div>
  );
}
