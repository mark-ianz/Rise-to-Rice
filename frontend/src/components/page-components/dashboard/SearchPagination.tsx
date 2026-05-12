import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function SearchPagination({
  hasPrev,
  hasNext,
}: {
  hasPrev: boolean | undefined;
  hasNext: boolean | undefined;
}) {
  const { t } = useTranslation("global");

  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = (action: "next" | "prev") => {
    const newSearchParams = new URLSearchParams(searchParams);

    const currentPage = parseInt(searchParams.get("page") || "1");
    newSearchParams.set(
      "page",
      action === "next"
        ? (currentPage + 1).toString()
        : (currentPage - 1).toString()
    );
    setSearchParams(newSearchParams);
  };

  return (
    <Pagination className="text-tertiary">
      <PaginationContent>
        <PaginationItem>
          <Button
            disabled={!hasPrev}
            variant={"link"}
            onClick={() => handleChangePage("prev")}
            className="w-[100px]"
          >
            <PaginationPrevious text={t("pagination.previous")}/>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            disabled={!hasNext}
            variant={"link"}
            onClick={() => handleChangePage("next")}
            className="w-[100px]"
          >
            <PaginationNext text={t("pagination.next")}/>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
