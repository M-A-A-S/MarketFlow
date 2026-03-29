const PageHeader = ({ title, description, leftSection }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
      <div>{leftSection}</div>
    </header>
  );
};
export default PageHeader;
