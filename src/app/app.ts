import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { ToastContainer } from './layout/toast-container/toast-container';
import { Footer } from './layout/footer/footer';
import { Chatbot } from './features/chatbot/pages/chatbot/chatbot';
import { UpdateService } from './core/services/update.service';
import { InstallService } from './features/pwa/data-access/install.service';
import { ConnectionService } from './features/pwa/data-access/connection.service';
import { OfflineBanner } from './features/pwa/components/offline-banner/offline-banner';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastContainer,Footer,Chatbot,OfflineBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly updateService = inject(UpdateService);
  private readonly installService = inject(InstallService);
  protected readonly offline = inject(ConnectionService).offline;
}
