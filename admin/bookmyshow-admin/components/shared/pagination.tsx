"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({ page, pageCount, onPageChange, totalItems, pageSize }: PaginationProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t px-2 py-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        {totalItems !== undefined && pageSize !== undefined
          ? `Showing ${Math.min((page - 1) * pageSize + 1, totalItems)}–${Math.min(page * pageSize, totalItems)} of ${totalItems}`
          : `Page ${page} of ${pageCount}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <span className="text-xs text-muted-foreground">
          {page} / {Math.max(pageCount, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
