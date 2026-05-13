import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import CampaignCard from "./CampaignCard";

export default function CampaignGrid({
  data,
  totalPages,
  currentPage,
  onPageChange,
}: {
  data: any[];
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          {/* gap-1 or gap-2 ensures items aren't squashed */}
          <PaginationContent className="flex-wrap justify-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                // Added !flex-row and items-center to prevent the stacking seen in your screenshot
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(i + 1);
                  }}
                  className="cursor-pointer w-9 h-9 flex items-center justify-center"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                // Added !flex-row and items-center here as well
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
