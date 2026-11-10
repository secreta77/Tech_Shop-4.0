import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../data-access/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { AuthFeature } from '../../models/auth.model';

@Component({
  selector: 'app-verify-email',
  imports: [FormField,FormRoot,RouterLink, AuthLayout],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmail {
  protected readonly features: AuthFeature[] = [
    { icon: 'bi bi-shield-check', title: 'Fast & Secure', text: 'Enterprise-grade security to keep your data safe' },
    { icon: 'bi bi-lightning-charge', title: 'Lightning Speed', text: 'Experience blazing fast performance' },
    { icon: 'bi bi-headset', title: '24/7 Support', text: 'Our team is always here to help you succeed' },
  ];

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly toast = inject(ToastService)


  protected readonly email = inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? ''
  
  private readonly model = signal({code:''})

  protected readonly verifyFrom = form(
    this.model,
    (f)=>{
      required(f.code,{message:'Verification code is required'})
    },
    {
      submission:{
        action:async() =>{
          try{
            await firstValueFrom(
              this.authService.verifyEmail({email:this.email,code:this.model().code})

            )
            this.toast.success('Email verified. You can now sign in.')
            await this.router.navigate(['/login'])
          }catch{

          }
        }
      }
    }
  )
  protected async resend():Promise<void>{
    try{
      await firstValueFrom(this.authService.resendCode(this.email))
      this.toast.success('A new code has been sent to your email.')

    }catch{

    }

  }

}


