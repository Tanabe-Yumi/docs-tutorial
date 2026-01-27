"use client";

import { ReactNode } from "react";
import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
import { FullscreenLoader } from "./fullscreen-loader";
import { GuestLogin } from "./guest-login";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ゲストユーザーの認証情報
const guestEmail1 = process.env.NEXT_PUBLIC_CLERK_GUEST_EMAIL_1 || undefined;
const guestPassword1 =
  process.env.NEXT_PUBLIC_CLERK_GUEST_PASSWORD_1 || undefined;
const guestEmail2 = process.env.NEXT_PUBLIC_CLERK_GUEST_EMAIL_2 || undefined;
const guestPassword2 =
  process.env.NEXT_PUBLIC_CLERK_GUEST_PASSWORD_2 || undefined;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {/* 認証されているときの表示 */}
        <Authenticated>{children}</Authenticated>

        {/* 認証されていないときの表示 */}
        <Unauthenticated>
          <div className="flex flex-col items-center justify-center gap-y-10 min-h-screen">
            <SignIn routing="hash" />
            {/* ゲストログイン */}
            <div className="flex flex-col items-center justify-center gap-y-2">
              <GuestLogin
                name="guestuser1"
                email={guestEmail1}
                password={guestPassword1}
              />
              <GuestLogin
                name="guestuser2"
                email={guestEmail2}
                password={guestPassword2}
              />
            </div>
          </div>
        </Unauthenticated>

        {/* 認証情報を確認中の表示 */}
        <AuthLoading>
          <FullscreenLoader label="Auth loading..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
