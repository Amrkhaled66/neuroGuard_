const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <h1 className="font-headline text-3xl font-bold leading-tight sm:text-4xl">
        {title}
      </h1>
      <p className="text-fontColor max-w-3xl text-sm leading-6 sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
