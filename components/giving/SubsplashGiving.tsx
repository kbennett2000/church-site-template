export function SubsplashGiving({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <iframe
        src={url}
        title="Online Giving"
        className="h-[700px] w-full max-w-2xl rounded-xl border border-border"
        allow="payment"
      />
      <p className="text-xs text-muted-foreground">
        Powered by Subsplash.
      </p>
    </div>
  );
}
