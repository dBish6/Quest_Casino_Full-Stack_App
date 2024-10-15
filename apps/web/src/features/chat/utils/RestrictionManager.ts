import type { AppDispatch } from "@redux/store";
import { UPDATE_RESTRICTION_TIME, RESTRICTION_RESET_TIME_ELAPSED, TOGGLE_RESTRICTION } from "@chatFeat/redux/chatSlice";

/**
 * Manages a chat restriction. 
 * 
 * For if the user is spamming messages and also handles the reset of a restriction meaning if
 * they have been 'good' for awhile, the reset countdown will elapse and the restriction multiplier will be decreased in 
 * chat's redux state. Also, handles a beforeunload event for persisting the restriction state even if the user refreshes 
 * or leaves the page.
 */
export default class RestrictionManager {
  private dispatch: AppDispatch;
  private remaining = { spam: 0, reset: 0 };
  public resetCountdown: NodeJS.Timeout | undefined;
  public spamCooldown: NodeJS.Timeout | undefined;
  private beforeunloadListener: (() => void) | undefined;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  public startRestrictionResetCountdown(duration: number) {
    clearInterval(this.resetCountdown);
    this.remaining.reset = duration;

    this.resetCountdown = setInterval(() => {
      this.remaining.reset -= 1000;
      if (this.remaining.reset <= 0) {
        this.dispatch(RESTRICTION_RESET_TIME_ELAPSED());
        clearInterval(this.resetCountdown);
      }
    }, 1000);

    this.listenForAppLeave();
  }

  public startSpamCooldown(duration: number) {
    clearInterval(this.spamCooldown);
    this.remaining.spam = duration;

    const handleSpamCountdown = () => {
      const timeElem = document.getElementById("coolCounter")!,
        time = this.remaining.spam;

      if (timeElem) {
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24),
          minutes = Math.floor((time / (1000 * 60)) % 60),
          seconds = Math.floor((time / 1000) % 60);
        timeElem.innerText =
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      if (time <= 0) {
        clearInterval(this.spamCooldown);
        setTimeout(() => this.dispatch(TOGGLE_RESTRICTION(false)), 1000);
        return;
      }

      this.remaining.spam -= 1000;
    };
    this.spamCooldown = setInterval(handleSpamCountdown, 1000);
    handleSpamCountdown();

    this.listenForAppLeave();
  }

  public cleanupAndUpdateTimes() {
    clearInterval(this.spamCooldown);
    clearInterval(this.resetCountdown);
    window.removeEventListener("beforeunload", this.beforeunloadListener || (() => {}));
    this.updateRestrictionTimes();
  }

  private listenForAppLeave() {
    window.removeEventListener("beforeunload", this.beforeunloadListener || (() => {}));

    this.beforeunloadListener = this.updateRestrictionTimes.bind(this);
    window.addEventListener("beforeunload", this.beforeunloadListener);
  }

  private updateRestrictionTimes() {
    if (this.remaining.spam)
      this.dispatch(UPDATE_RESTRICTION_TIME({ time: this.remaining.spam, key: "remaining" }));
    if (this.remaining.reset)
      this.dispatch(UPDATE_RESTRICTION_TIME({ time: this.remaining.reset, key: "resetTime" }));
  }
}
