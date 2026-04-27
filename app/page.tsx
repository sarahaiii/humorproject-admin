export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="glass-card w-full max-w-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">
                    HUMOR PROJECT
                </p>

                <h1 className="mt-3 text-5xl font-bold text-[#0c1a2e]">
                    Admin Portal
                </h1>

                <p className="mt-4 text-[#6a9cbf]">
                    Manage users, images, captions, and monitor live content trends.
                </p>

                <div className="mt-10">
                    <a href="/auth/login" className="neon-button">
                        Sign in with Google
                    </a>
                </div>
            </div>
        </main>
    );
}
