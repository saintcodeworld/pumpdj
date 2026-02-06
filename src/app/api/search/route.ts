import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.adminforge.de',
];

function extractVideoId(query: string): string | null {
    const match = query.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{11})/);
    return match?.[1] || null;
}

async function searchWithPiped(query: string) {
    for (const instance of PIPED_INSTANCES) {
        try {
            const res = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=videos`, {
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) continue;

            const data = await res.json();
            const items = data.items || data;
            if (items.length > 0) {
                const best = items[0];
                const videoId = best.url?.replace('/watch?v=', '') || best.id;
                return {
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    title: best.title,
                    duration: best.duration ? `${Math.floor(best.duration / 60)}:${String(best.duration % 60).padStart(2, '0')}` : undefined,
                    image: best.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                };
            }
        } catch {
            continue;
        }
    }
    return null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const isUrl = query.includes('youtube.com') || query.includes('youtu.be');
    const searchTerm = isUrl ? (extractVideoId(query) || query) : query;

    try {
        const r = await ytSearch(searchTerm);
        if (r.videos.length > 0) {
            const best = r.videos[0];
            return NextResponse.json({
                url: best.url,
                title: best.title,
                duration: best.timestamp,
                image: best.image,
            });
        }
    } catch {
        console.error('yt-search failed, trying Piped API fallback');
    }

    const pipedResult = await searchWithPiped(searchTerm);
    if (pipedResult) {
        return NextResponse.json(pipedResult);
    }

    if (isUrl) {
        const videoId = extractVideoId(query);
        if (videoId) {
            return NextResponse.json({
                url: `https://www.youtube.com/watch?v=${videoId}`,
                title: 'YouTube Video',
                image: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            });
        }
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
}
