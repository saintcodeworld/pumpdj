import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || 'cyberpunk dark synthwave mix';
    
    try {
        // Search for videos matching the genre/query
        const r = await ytSearch(genre);
        const videos = r.videos.slice(0, 15); // Get top 15 results

        if (videos.length > 0) {
            const tracks = videos.map(v => ({
                id: v.videoId,
                url: v.url,
                title: v.title,
                duration: v.timestamp,
                image: v.thumbnail,
                author: v.author.name
            }));

            return NextResponse.json(tracks);
        } else {
            return NextResponse.json({ error: 'No tracks found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Track fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }
}
