import Input from "../../../../components/UI/Input";

const AmountInputRow = ({
  label,
  value,
  type,
  min,
  max,
  onChange,
  ...props
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <Input
      max={max}
      min={min}
      type={type}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-24"
      {...props}
    />
  </div>
);

export default AmountInputRow;
