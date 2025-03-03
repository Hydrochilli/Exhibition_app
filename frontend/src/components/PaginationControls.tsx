import React from "react";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      {/* First Page */}
      <button
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        ⏮ First
      </button>

      {/* Previous Page */}
      <button
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀ Prev
      </button>

      {/* Current Page Info */}
      <span className="px-4 py-2 text-lg font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Page */}
      <button
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ▶
      </button>

      {/* Last Page */}
      <button
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        ⏭ Last
      </button>
    </div>
  );
};

export default PaginationControls;
