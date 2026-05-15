export function GenericIframeGiving({
  url,
  height,
}: {
  url: string;
  height: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <iframe
        src={url}
        title="Online Giving"
        className="w-full max-w-2xl rounded-xl border border-border"
        style={{ height: `${height}px` }}
        allow="payment"
      />
    </div>
  );
}
