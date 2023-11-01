type PageTitleProps = {
  title: string;
};
export default function PageTitle({ title }: PageTitleProps) {
  return (
    <h1
      style={{
        textAlign: "center",
        marginBottom: "20px",
        // textShadow: "-10px 10px 10px #b1b1b1",
      }}
    >
      {title}
    </h1>
  );
}
