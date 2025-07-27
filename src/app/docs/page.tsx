import { redirect } from "next/navigation";

// Redirect to documentation overview
export default function DocsPage() {
  redirect("/docs/overview");
}