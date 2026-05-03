"use client";
import { Button } from "@/src/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  rowsPerPage: number;
}

export const TablePagination = ({
  currentPage,
  totalRecords,
  rowsPerPage,
  totalPages,
  onPageChange,
}: any) => {
  const startRange =
    totalRecords === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRange = Math.min(currentPage * rowsPerPage, totalRecords);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium">{startRange} to {endRange}</span> of{" "}
        <span className="font-medium">{totalRecords.toLocaleString()}</span>donations
        donations
      </p>
<Pagination className="justify-end w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <Button 
              variant="ghost" 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>
          </PaginationItem>

          {/* Dynamic Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                className={currentPage === page ? "bg-indigo-600 text-white" : ""}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              variant="ghost" 
              text=" Next"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
            />
             
            
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
