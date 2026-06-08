import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (
    await (locale === "en"
      ? import("@satellite-control/shared/i18n/en")
      : import("@satellite-control/shared/i18n/vi"))
  ).default;

  return {
    locale,
    messages,
  };
});
