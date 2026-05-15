import givingData from "@/content/giving.json";

export type GivingProvider =
  | "planning_center"
  | "tithely"
  | "pushpay"
  | "subsplash"
  | "stripe"
  | "custom_url"
  | "offline_only";

export type GivingDisplayMode = "modal" | "newTab" | "redirect";

export type GivingConfig = {
  provider: GivingProvider;
  displayMode: GivingDisplayMode;
  callToAction: string;
  supportingMessage: string;
  planningCenter: { subdomain: string };
  tithely: { organizationId: string; formUrl: string };
  pushpay: { merchantHandle: string };
  subsplash: { embedCode: string };
  stripe: { paymentLinkUrl: string };
  customUrl: { url: string; linkText: string };
  offlineGiving: {
    enabled: boolean;
    mailingAddress: string;
    inPersonInstructions: string;
    textToGive: { enabled: boolean; number: string; keyword: string };
  };
  faq: Array<{ question: string; answer: string }>;
};

export const givingConfig = givingData as GivingConfig;

// Returns the href for the Give button. Internal paths ("/give") are returned
// for providers that embed on-page (subsplash) or have no online giving
// (offline_only). All other providers return external URLs.
export function getGivingHref(config: GivingConfig): string {
  switch (config.provider) {
    case "planning_center": {
      const base = `https://${config.planningCenter.subdomain}.churchcenter.com/giving`;
      return config.displayMode === "modal"
        ? `${base}?open-in-church-center-modal=true`
        : base;
    }
    case "tithely": {
      if (config.tithely.formUrl) return config.tithely.formUrl;
      return `https://tithe.ly/give_new/www/#/tithely/give-one-time/${config.tithely.organizationId}`;
    }
    case "pushpay": {
      return `https://pushpay.com/g/${config.pushpay.merchantHandle}`;
    }
    case "subsplash": {
      // Subsplash is embedded on the /give page; the button navigates there.
      return "/give";
    }
    case "stripe": {
      return config.stripe.paymentLinkUrl;
    }
    case "custom_url": {
      return config.customUrl.url;
    }
    case "offline_only": {
      return "/give";
    }
  }
}

// True only when the provider requires an external modal script. Currently
// only Planning Center in modal mode. Used to conditionally inject the script
// tag in the layout without loading it for every church.
export function shouldLoadModalScript(config: GivingConfig): boolean {
  return config.provider === "planning_center" && config.displayMode === "modal";
}

// Returns the script URL to inject when shouldLoadModalScript is true.
export function getModalScriptSrc(config: GivingConfig): string | null {
  if (shouldLoadModalScript(config)) {
    return "https://js.churchcenter.com/modal/v1";
  }
  return null;
}

// Human-readable provider name for "Powered by" attributions.
export function getProviderDisplayName(config: GivingConfig): string {
  switch (config.provider) {
    case "planning_center": return "Planning Center Giving";
    case "tithely": return "Tithe.ly";
    case "pushpay": return "Pushpay";
    case "subsplash": return "Subsplash Giving";
    case "stripe": return "Stripe";
    case "custom_url": return config.customUrl.linkText || "Online Giving";
    case "offline_only": return "";
  }
}
