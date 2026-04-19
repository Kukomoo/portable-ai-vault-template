// app/api/vaults/route.ts
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
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated`,
      { headers: authHeaders, cache: 'no-store' }
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos = await res.json() as Array<{
      name: string;
      description: string | null;
      topics: string[];
      updated_at: string;
      private: boolean;
    }>;

    const memoryRepos = repos.filter((r) => r.topics?.includes('ai-memory-vault'));

    const vaults = memoryRepos.map((repo) => {
      const desc = repo.description ?? '';

      let icon = 'barChart';
      let description = desc;

      // ✅ New format: "[iconId] description" e.g. "[brain] My notes"
      const idMatch = desc.match(/^\[([a-zA-Z0-9_-]+)\]\s*/);
      if (idMatch) {
        icon = idMatch[1];
        description = desc.replace(idMatch[0], '').trim();
      } else {
        // ✅ Legacy format: emoji at start e.g. "🧠 My notes"
        const emojiMatch = desc.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
        if (emojiMatch) {
          icon = emojiMatch[0];
          description = desc.replace(emojiMatch[0], '').trim();
        } else {
          // ✅ Old broken format: plain icon ID at start e.g. "brain My notes"
          // Check if first word is a known icon ID
          const firstWord = desc.split(' ')[0];
          const KNOWN_IDS = [
            'brain','rocket','people','briefcase','books','target','bulb','microscope',
            'globe','build','robot','tools','memo','palette','fire','lightning','sprout',
            'trophy','crystal','chart','lion','wave','puzzle','folder','graph','key',
            'compass','diamond','map','stamp','map2','laptop','phone','monitor','chip',
            'wifi','satellite','dna','flask','ruler','calendar','pin','link','chat',
            'inbox','ballot','gear','wrench','disk','camera','mic','headphones','pen',
            'lock','cloud','terminal','branch','api','db','deploy','search','grad',
            'home2','handshake','muscle','meditate','plane','moon','sun','leaf','clapper',
            'music','brush','pencil2','notebook','thought','star','chess','medal',
            'hourglass','seedling','flag','infinity','heartbeat','gift','crown','orbit',
            'anchor','feather','sparkle','lantern',
          ];
          if (KNOWN_IDS.includes(firstWord)) {
            icon = firstWord;
            description = desc.slice(firstWord.length).trim();
          } else {
            // truly unknown — keep barChart default
            description = desc;
          }
        }
      }

      const name = repo.name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return { slug: repo.name, name, icon, description };
    });

    return NextResponse.json({ vaults }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}