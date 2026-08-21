import { auth, UnauthorizedException } from "@/lib";
import type { SignInEmail, SignInEmailResponse } from "@admin/types";

export class AuthService {
  async signInEmail(payload: SignInEmail, headers?: HeadersInit) {
    const response = await auth.api.signInEmail({
      body: payload,
      asResponse: true,
      ...(headers ? { headers } : {}),
    });

    if (!response.ok)
      throw new UnauthorizedException({
        message: "Invalid Credential",
      });

    const data = (await response.json()) as SignInEmailResponse;
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }

  async logOut(headers: HeadersInit) {
    const response = await auth.api.signOut({
      headers,
      asResponse: true,
    });

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }

  async getSession(headers: HeadersInit) {
    return await auth.api.getSession({
      headers,
    });
  }
}
