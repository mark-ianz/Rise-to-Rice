import SelectDropDown from "@/components/page-components/view_profile/SelectDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  searchForItems: { value: string; label: string }[];
};

export default function SearchForm({ searchForItems }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFor, setSearchFor] = useState<{ value: string; label: string }>(searchForItems[0]);

  const searchRef = useRef<HTMLInputElement>(null);

  const handleOnValueChange = (value: string) => {
    setSearchFor({
      value: value,
      label: searchForItems.find((item) => item.value === value)?.label || "",
    });
  };

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newParams = new URLSearchParams(searchParams);

    newParams.set("search", searchRef.current?.value || "");
    newParams.set("searchFor", searchFor.value);
    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  return (
    <form className="flex gap-2 items-center" onSubmit={handleSearchSubmit}>
      <Input
        ref={searchRef}
        type="search"
        name="search"
        className="bg-white max-md:text-sm max-xsm:text-xs"
        placeholder={`Search by ${searchFor.label}...`}
      />
      <SelectDropDown
        items={searchForItems}
        value={searchFor.value}
        onValueChange={handleOnValueChange}
      >
        {searchFor.label}
      </SelectDropDown>
      <Button className="max-md:text-xs" size={"sm"}>Search</Button>
    </form>
  );
}
