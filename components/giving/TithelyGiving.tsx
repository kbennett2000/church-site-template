import Script from "next/script";

export function TithelyGiving({ churchId }: { churchId: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Tithe.ly v3 widget — renders the give button automatically. */}
      <Script
        src={`https://tithe.ly/widget/v3/give.js#churchId=${churchId}`}
        strategy="lazyOnload"
      />
      <p className="text-xs text-muted-foreground">
        Powered by Tithe.ly.
      </p>
    </div>
  );
}
