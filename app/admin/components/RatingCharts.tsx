"use client";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend,
} from "recharts";

export type ScoreBucket = { label: string; count: number };
export type CaptionChartRow = { label: string; likes: number; dislikes: number; score: number };

const BUCKET_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#94a3b8", "#14b8a6", "#10b981", "#059669"];

const tooltipStyle = {
    borderRadius: 12,
    border: "1px solid rgba(120,175,255,0.3)",
    background: "rgba(255,255,255,0.97)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    fontSize: 13,
};

export function ScoreDistributionChart({ data }: { data: ScoreBucket[] }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6a9cbf" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6a9cbf" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => [v, "Captions"]}
                    cursor={{ fill: "rgba(120,175,255,0.08)" }}
                />
                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {data.map((_, i) => (
                        <Cell key={i} fill={BUCKET_COLORS[i]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function VoteBreakdownChart({ data }: { data: CaptionChartRow[] }) {
    const chartHeight = Math.max(data.length * 52, 240);
    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 12, fill: "#6a9cbf" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                    dataKey="label"
                    type="category"
                    tick={{ fontSize: 11, fill: "#1a3a5c" }}
                    width={170}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(120,175,255,0.08)" }}
                />
                <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, color: "#6a9cbf", paddingTop: 8 }}
                />
                <Bar dataKey="likes" name="👍 Likes" fill="#10b981" stackId="v" radius={[0, 0, 0, 0]} />
                <Bar dataKey="dislikes" name="👎 Dislikes" fill="#f43f5e" stackId="v" radius={[0, 3, 3, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function LikeRateDonut({ likes, dislikes }: { likes: number; dislikes: number }) {
    const data = [
        { name: "👍 Funny", value: likes },
        { name: "👎 Not Funny", value: dislikes },
    ];
    const COLORS = ["#10b981", "#f43f5e"];
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={82}
                    dataKey="value"
                    paddingAngle={data.every(d => d.value === 0) ? 0 : 3}
                    startAngle={90}
                    endAngle={-270}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, name) => [typeof v === "number" ? v.toLocaleString() : v, name]}
                />
                <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, color: "#6a9cbf" }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
