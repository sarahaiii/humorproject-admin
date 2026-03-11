import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const supabase = await createClient();

    await supabase
        .from("whitelist_email_addresses")
        .delete()
        .eq("id", id);

    return NextResponse.redirect(new URL("/admin/whitelist-emails", request.url));
}