import { ChangeDetectionStrategy, Component,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { ToastContainer } from './layout/toast-container/toast-container';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  

}
