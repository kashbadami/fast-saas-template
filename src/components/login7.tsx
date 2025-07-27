import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const Login7 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-4">
          <Card className="mx-auto w-full max-w-[380px]">
            <CardHeader className="items-center justify-center">
              <a
                href="https://www.shadcnblocks.com"
                className="flex items-center gap-2"
              >
                <div className="relative h-8 w-8">
                  <Image
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                    alt="Shadcn UI Navbar"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-semibold tracking-tighter">
                  Shadcnblocks.com
                </span>
              </a>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button variant="outline" className="w-full">
                  <div className="relative mr-2 h-4 w-4">
                    <Image
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/google-icon.svg"
                      alt="Google"
                      fill
                      className="object-contain"
                    />
                  </div>
                  Sign up with Google
                </Button>
                <div className="flex items-center gap-4">
                  <span className="h-px w-full bg-input"></span>
                  <span className="text-xs text-muted-foreground">OR</span>
                  <span className="h-px w-full bg-input"></span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log in
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="mx-auto flex gap-1 text-sm">
            <p>Don&apos;t have an account yet?</p>
            <a href="#" className="underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login7 };
