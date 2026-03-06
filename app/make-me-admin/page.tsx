"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function MakeMeAdminPage() {
    const [message, setMessage] = useState("");

    const handleClick = async () => {
        const supabase = createClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setMessage("Not logged in.");
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .update({ is_superadmin: true })
            .eq("id", user.id)
            .select();

        if (error) {
            setMessage(`Error: ${error.message}`);
            return;
        }

        setMessage(`Success: ${JSON.stringify(data)}`);
    }

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">Bootstrap Admin</h1>
            <button
                onClick={handleClick}
                className="mt-6 rounded bg-black px-6 py-3 text-white"
            >
                Make me admin
            </button>
            <p className="mt-6 whitespace-pre-wrap">{message}</p>
        </main>
    );
}