// Redirects /tools/[slug] → /[slug] for backward compatibility
import { redirect } from "next/navigation";

export default async function ToolsSlugRedirect({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    redirect(`/${slug}`);
}
