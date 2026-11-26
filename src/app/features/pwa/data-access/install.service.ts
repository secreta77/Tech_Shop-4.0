import { computed, Injectable, inject, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { BeforeInstallPromptEvent, NavigatorWithStandalone } from '../models/install-prompt.model';

const FALLBACK_HINT =
  'Open the browser menu and choose "Install STEP TECH" (available on the live site in Chrome or Edge)';

@Injectable({
  providedIn: 'root',
})
export class InstallService {
  private readonly toastService = inject(ToastService);

  private readonly deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);
  private readonly installed = signal(this.isStandalone());

  private readonly manualHint = this.getManualHint();

  readonly canShow = computed(() => !this.installed());

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt.set(event as BeforeInstallPromptEvent);
    });

    window.addEventListener('appinstalled', () => {
      this.installed.set(true);
      this.deferredPrompt.set(null);
    });
  }

  async install(): Promise<void> {
    const prompt = this.deferredPrompt();

    if (!prompt) {
      this.toastService.success(this.manualHint ?? FALLBACK_HINT);
      return;
    }

    await prompt.prompt();
    const choice = await prompt.userChoice;

    this.deferredPrompt.set(null);

    if (choice.outcome === 'accepted') {
      this.installed.set(true);
    }
  }

  private isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as NavigatorWithStandalone).standalone === true
    );
  }

  private getManualHint(): string | null {
    const agent = navigator.userAgent;
    const isSafari = /safari/i.test(agent) && !/chrome|chromium|crios|fxios|edg|android/i.test(agent);

    if (!isSafari) {
      return null;
    }

    const isIos = /iphone|ipad|ipod/i.test(agent) || (navigator.maxTouchPoints > 1 && /macintosh/i.test(agent));

    return isIos
      ? 'Tap the Share button, then choose "Add to Home Screen"'
      : 'In the menu bar choose File, then "Add to Dock"';
  }
}
