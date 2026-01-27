"use client";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GuestLoginProps {
  name: string;
  email?: string;
  password?: string;
}

export function GuestLogin({ name, email, password }: GuestLoginProps) {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleGuestLogin = async () => {
    if (!signIn || !email || !password) {
      toast.error(`Failed to guest login with ${name}`);
      return;
    }

    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (error) {
      toast.error(`Failed to guest login: ${error}`);
    }
  };

  return (
    <Button
      onClick={handleGuestLogin}
      variant="ghost"
      className="cursor-pointer font-medium text-base p-4"
    >
      Guest login with {name}
    </Button>
  );
}
