import { CheckSquare, FolderKanban, Users } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const Signup7 = () => {
  return (
    <section className="bg-muted/60 2xl:bg-background py-32">
      <div className="container lg:max-w-[1400px] lg:px-0 2xl:px-8">
        <div className="border-border lg:bg-muted/30 grid rounded-2xl lg:grid-cols-2 2xl:border 2xl:py-10">
          <div className="mx-auto flex max-w-xl flex-col justify-between lg:px-20">
            <div className="lg:mt-24">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                  Create your account today
                </h1>
                <p className="text-muted-foreground font-medium">
                  Basic plan for personal use. Premium plans for teams and
                  businesses.
                </p>
              </div>
              <div className="mt-16 flex flex-col gap-6">
                <Button>
                  <FcGoogle />
                  Continue with Google
                </Button>
                <div className="flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-muted-foreground text-sm">or</span>
                  <Separator className="flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline">Continue with Email</Button>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary"
                  >
                    or Enterprise SSO
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-muted-foreground text-sm">
                Already a user?{" "}
                <a href="/#" className="text-primary">
                  Log in
                </a>
              </p>
              <p className="text-muted-foreground text-sm">
                By continuing, you agree to our{" "}
                <a href="/#" className="text-primary">
                  Terms{" "}
                </a>
                and{" "}
                <a href="/#" className="text-primary">
                  Privacy Policy.
                </a>
              </p>
            </div>
          </div>
          <div className="border-border lg:bg-muted/60 rounded-l-2xl pt-14 lg:border-y lg:border-l lg:py-8 lg:pl-12">
            <div className="mx-auto flex max-w-xl justify-between gap-4 lg:mx-0 lg:max-w-none lg:justify-start lg:gap-8">
              <div className="flex flex-row items-center gap-4">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/ph-monthly.svg"
                  alt="g2 monthly"
                  className="h-10"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/producthunt-badge.png"
                  alt="g2"
                  className="h-10"
                />
              </div>
            </div>
            <div className="border-border bg-muted mt-6 hidden rounded-l-xl border-y border-l border-dashed py-1.5 pl-1.5 lg:block">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg"
                alt="placeholder"
                className="border-border max-h-[450px] w-full rounded-l-xl border-y border-l object-cover"
              />
            </div>
            <div className="mr-3 mt-8 hidden grid-cols-3 gap-3 lg:grid">
              <div>
                <FolderKanban className="mb-1 size-4" />
                <p className="text-sm font-medium">Organize your workspaces</p>
                <p className="text-muted-foreground text-sm">
                  Keep all your work organized in one centralized dashboard.
                </p>
              </div>
              <div>
                <CheckSquare className="mb-1 size-4" />
                <p className="text-sm font-medium">Track tasks and deadlines</p>
                <p className="text-muted-foreground text-sm">
                  Set priorities and monitor progress across all your projects.
                </p>
              </div>
              <div>
                <Users className="mb-1 size-4" />
                <p className="text-sm font-medium">
                  Collaborate with your team
                </p>
                <p className="text-muted-foreground text-sm">
                  Share documents and communicate with teammates in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup7 };