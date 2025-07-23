import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type RouterOutputs } from "~/trpc/react";

type Blog = RouterOutputs["blog"]["getAll"][number];

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
        <CardDescription>
          By {blog.author.name ?? "Anonymous"} •{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {blog.excerpt ?? blog.content.slice(0, 150) + "..."}
        </p>
      </CardContent>
      <CardFooter>
        <a
          href={`/blog/${blog.id}`}
          className="text-sm font-medium hover:underline"
        >
          Read more →
        </a>
      </CardFooter>
    </Card>
  );
}