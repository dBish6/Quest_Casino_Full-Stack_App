import { logger } from "@qc/utils";

export default async function handleRequestByLink(
  triggerId: string,
  callback: () => Promise<void>
) {
  const button = document.getElementById(triggerId);
  if (!button) return logger.error(`Button with ID '${triggerId}' was not found.`);

  const initialText = button?.innerText;
  button.setAttribute("aria-live", "polite");
  button.setAttribute("disabled", "");
  button.innerText = "Loading...";

  await callback().finally(() => {
    button.removeAttribute("disabled");
    button.innerText = initialText;
  });
}
