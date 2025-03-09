import { ProjectPageResponse } from "@/types/pages";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ListOrderedIcon } from "lucide-react";
export default function ProjectTaskFilterSection({
  data,
}: {
  data: ProjectPageResponse;
}) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between bg-widgetsColor py-2 px-3 rounded-[20px] my-5">
      <h1 className="text-md font-bold capitalize text-fontColor">
        {data.tasks.length} Tasks
      </h1>

      <div className="flex flex-row gap-2 items-center justify-around">
        <Select>
          <SelectTrigger className="w-[120px]">
            <Filter className="h-5 w-5" />
            Filter
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <ListOrderedIcon className="h-5 w-5" />
            Order
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
