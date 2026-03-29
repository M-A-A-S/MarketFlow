import { Grid2x2, TextAlignJustify } from "lucide-react";
import Button from "./Button";

const ViewSwitcher = ({ view, setView }) => {
  return (
    <div
      className=" flex
        w-fit
        m-1
        rounded-xl
        bg-purple-200
        transition-colors
        hover:bg-purple-300"
    >
      <Button
        onClick={() => setView("table")}
        title="Table View"
        className={`w-full
          h-full
          p-3
          rounded-xl ${view === "table" ? "bg-purple-500" : "bg-purple-300"}`}
      >
        <TextAlignJustify />
      </Button>
      <Button
        onClick={() => setView("card")}
        title="Table View"
        className={`w-full
          h-full
          p-3
          rounded-xl ${view === "card" ? "bg-purple-500 " : "bg-purple-300"}`}
      >
        <Grid2x2 />
      </Button>
    </div>
  );
};

export default ViewSwitcher;
