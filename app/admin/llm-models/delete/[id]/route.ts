import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    await supabase
        .from("llm_models")
        .delete()
        .eq("id", id);

    return NextResponse.redirect(
        new URL("/admin/llm-models", request.url)
    );
}