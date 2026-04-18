// app/api/vaults/route.ts
// Lists all of the authenticated user's GitHub repos tagged as AI memories
import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export async function GET() {
  try {
    // Fetch all repos for the authenticated user
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated`,
      { headers: authHeaders, cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json() as Array<{
      name: string;
      description: string | null;
      topics: string[];
      updated_at: string;
      private: boolean;
    }>;

    // Only include repos tagged with the ai-memory-vault topic
    const memoryRepos = repos.filter((r) => r.topics?.includes('ai-memory-vault'));

    const vaults = memoryRepos.map((repo) => {
      // Parse icon from description prefix, e.g. "🧠 My personal AI memory"
      const desc = repo.description ?? '';
      const emojiMatch = desc.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
      const icon = emojiMatch ? emojiMatch[0] : '📊';
      const description = emojiMatch ? desc.replace(emojiMatch[0], '').trim() : desc;

      // Convert repo name to friendly display name
      const name = repo.name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        slug: repo.name,
        name,
        icon,
        description,
      };
    });

    return NextResponse.json({ vaults }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
