import { ChangeDetectionStrategy, Component,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { ToastContainer } from './layout/toast-container/toast-container';
import { Footer } from './layout/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastContainer,Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  

}
