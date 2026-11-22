import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { disabled, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { ProfileService } from '../../data-access/profile.service';

@Component({
  selector: 'app-my-profile',
  imports: [FormField, FormRoot],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfile {
  private readonly profileService = inject(ProfileService);
  private readonly toastService = inject(ToastService);

  protected readonly user = this.profileService.currentUser;

  protected readonly initials = computed(() => {
    const user = this.user();
    return user ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase() : '';
  });

  private readonly initial = computed(() => {
    const user = this.user();
    return {
      pictureUrl: user?.details.pictureUrl ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      dateOfBirth: user?.details.dob ? user.details.dob.slice(0, 10) : '',
      phoneNumber: user?.details.phoneNumber ?? '',
      address: user?.details.address ?? '',
    };
  });

  private readonly model = linkedSignal(() => this.initial());

  protected readonly picture = computed(() => this.model().pictureUrl.trim());

  protected readonly profileForm = form(
    this.model,
    (f) => {
      required(f.firstName, { message: 'First name is required' });
      required(f.lastName, { message: 'Last name is required' });
      disabled(f.email);
    },
    {
      submission: {
        action: async () => {
          const data = this.model();
          try {
            await firstValueFrom(
              this.profileService.updateProfile({
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email,
                phoneNumber: data.phoneNumber.trim() || null,
                address: data.address.trim() || null,
                pictureUrl: data.pictureUrl.trim() || null,
                dateOfBirth: data.dateOfBirth ? `${data.dateOfBirth}T00:00:00` : null,
              }),
            );
            this.toastService.success('Profile updated successfully');
            this.profileForm().reset(data);
            this.profileService.reload();
          } catch {
            // errorInterceptor already showed the error toast
          }
        },
      },
    },
  );

  protected discard(): void {
    this.profileForm().reset(this.initial());
  }
}
