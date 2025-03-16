import React from "react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        ◀ Prev
      </button>

      <span className="px-4 py-2 text-lg font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next ▶
      </button>
    </div>
  );
};

export default PaginationControls;
