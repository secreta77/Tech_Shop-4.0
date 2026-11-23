import { ChangeDetectionStrategy, Component,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { ToastContainer } from './layout/toast-container/toast-container';
import { Footer } from './layout/footer/footer';
import { Chatbot } from './features/chatbot/pages/chatbot/chatbot';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastContainer,Footer,Chatbot],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  

}
