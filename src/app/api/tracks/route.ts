import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.adminforge.de',
];

const FALLBACK_TRACKS = [
    { id: "4xDzrJKXOOY", url: "https://www.youtube.com/watch?v=4xDzrJKXOOY", title: "Synthwave Retro Cyberpunk Mix", duration: "1:02:33", image: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg", author: "Synthwave Goose" },
    { id: "k3WkJq478To", url: "https://www.youtube.com/watch?v=k3WkJq478To", title: "Blade Runner Vibes - Cyberpunk Mix", duration: "1:00:07", image: "https://i.ytimg.com/vi/k3WkJq478To/hqdefault.jpg", author: "Aim To Head" },
    { id: "S5PvBzDlZGs", url: "https://www.youtube.com/watch?v=S5PvBzDlZGs", title: "Dark Synthwave Mix", duration: "1:01:36", image: "https://i.ytimg.com/vi/S5PvBzDlZGs/hqdefault.jpg", author: "Astral Throb" },
    { id: "sDI6HTR9arA", url: "https://www.youtube.com/watch?v=sDI6HTR9arA", title: "Darksynth / Cyberpunk Mix", duration: "1:00:43", image: "https://i.ytimg.com/vi/sDI6HTR9arA/hqdefault.jpg", author: "Aim To Head" },
    { id: "rDBbaGCCIhk", url: "https://www.youtube.com/watch?v=rDBbaGCCIhk", title: "Atmospheric Cyberpunk Music", duration: "1:30:02", image: "https://i.ytimg.com/vi/rDBbaGCCIhk/hqdefault.jpg", author: "Cyber City" },
    { id: "UEcOGMKSBcA", url: "https://www.youtube.com/watch?v=UEcOGMKSBcA", title: "Neon Noir - Dark Electronic", duration: "58:14", image: "https://i.ytimg.com/vi/UEcOGMKSBcA/hqdefault.jpg", author: "Neon Noir" },
];

async function searchWithPiped(query: string) {
    for (const instance of PIPED_INSTANCES) {
        try {
            const res = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=videos`, {
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) continue;

            const data = await res.json();
            const items = (data.items || data).slice(0, 15);
            if (items.length > 0) {
                return items.map((v: any) => {
                    const videoId = v.url?.replace('/watch?v=', '') || v.id;
                    return {
                        id: videoId,
                        url: `https://www.youtube.com/watch?v=${videoId}`,
                        title: v.title,
                        duration: v.duration ? `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, '0')}` : undefined,
                        image: v.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                        author: v.uploaderName || v.uploader || 'Unknown',
                    };
                });
            }
        } catch {
            continue;
        }
    }
    return null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || 'cyberpunk dark synthwave mix';

    try {
        const r = await ytSearch(genre);
        const videos = r.videos.slice(0, 15);
        if (videos.length > 0) {
            return NextResponse.json(videos.map(v => ({
                id: v.videoId,
                url: v.url,
                title: v.title,
                duration: v.timestamp,
                image: v.thumbnail,
                author: v.author.name
            })));
        }
    } catch {
        console.error('yt-search failed, trying Piped API fallback');
    }

    const pipedResult = await searchWithPiped(genre);
    if (pipedResult) {
        return NextResponse.json(pipedResult);
    }

    return NextResponse.json(FALLBACK_TRACKS);
}
