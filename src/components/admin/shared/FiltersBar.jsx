"use client";

import { useSetParams } from "@/hooks/setParams";
import SelectField from "@/components/ui/fields/SelectField";
import MultiSelectField from "@/components/ui/fields/MultiSelectField";
import SearchField from "@/components/ui/fields/SearchField";

const componentMap = {
  select: (props) => <SelectField {...props} />,
  multiSelect: (props) => <MultiSelectField {...props} />,
  search: ({ onChange, ...props }) => (
    <SearchField {...props} onSearch={onChange} />
  ),
};

export default function FiltersBar({ filters = [], searchParams = {} }) {
  const setParams = useSetParams();

  return (
    <div className="my-6 flex flex-col md:flex-row gap-2 xs:gap-3 md:gap-4 justify-between w-full min-h-full">
      {filters.map((filter, index) => {
        const { type, paramKey, value, ...rest } = filter;
        const Component = componentMap[type];

        return (
          <Component
            key={index}
            {...rest}
            value={value ?? searchParams[paramKey]}
            onChange={(value) => setParams({ page: 1, [paramKey]: value })}
          />
        );
      })}
    </div>
  );
}
