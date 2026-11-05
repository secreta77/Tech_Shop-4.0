import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  readonly isLoggedIn = computed(() => !!this.tokenStorage.accessToken());

  login(body: LoginRequest, remember: boolean): Observable<AuthTokens> {
    return this.http.post<ApiResponse<AuthTokens>>(`${this.baseUrl}/login`, body).pipe(
      map((response) => response.data),
      tap((tokens) =>
        this.tokenStorage.save(tokens.accessToken, tokens.refreshToken, remember),
      ),
    );
  }

  register(body: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/register`, body);
  }

  verifyEmail(body: VerifyEmailRequest): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/verify-email`, body);
  }

  resendCode(email: string): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}/resend-email-verification/${encodeURIComponent(email)}`,
      null,
    );
  }

  logout(): void {
    this.tokenStorage.clear();
  }
}
