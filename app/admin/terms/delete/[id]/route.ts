import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const supabase = await createClient();

    await supabase.from("terms").delete().eq("id", id);

    return NextResponse.redirect(new URL("/admin/terms", request.url));
}