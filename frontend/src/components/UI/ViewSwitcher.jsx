import { Grid2x2, TextAlignJustify } from "lucide-react";
import Button from "./Button";

export const ViewSwitcher = ({ view, setView }) => {
  return (
    <div
      className=" flex
        w-fit
        my-4
        rounded-xl
        bg-orange-200
        transition-colors
        hover:bg-orange-300"
    >
      <Button
        onClick={() => setView("table")}
        title="Table View"
        className={`w-full
          h-full
          p-3
          rounded-xl ${view === "table" ? "bg-orange-500" : "bg-transparent"}`}
      >
        <TextAlignJustify />
      </Button>
      <Button
        onClick={() => setView("card")}
        title="Table View"
        className={`w-full
          h-full
          p-3
          rounded-xl ${view === "card" ? "bg-orange-500 " : "bg-transparent"}`}
      >
        <Grid2x2 />
      </Button>
    </div>
  );
};
