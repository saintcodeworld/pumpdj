import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    try {
        // Simple check: if it acts like a URL, try to extract the ID or just search the URL
        let searchTerm = query;

        // If it's a youtube url, try to get just the video ID for better search results
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            const videoIdMatch = query.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{11})/);
            if (videoIdMatch && videoIdMatch[1]) {
                searchTerm = videoIdMatch[1]; // Search by ID
            }
        }

        const r = await ytSearch(searchTerm);
        const videos = r.videos;

        if (videos.length > 0) {
            const bestMatch = videos[0]; // Take the first result
            return NextResponse.json({
                url: bestMatch.url,
                title: bestMatch.title,
                duration: bestMatch.timestamp,
                image: bestMatch.image,
            });
        } else {
            return NextResponse.json({ error: 'No video found' }, { status: 404 });
        }
    } catch (error) {
        console.error('YouTube search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
