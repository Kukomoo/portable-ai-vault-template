// app/api/memory-create/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_OWNER;
const REPO_NAME = process.env.GITHUB_REPO;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

// Standard folder structure for every new memory vault
const FOLDERS = [
  '01-identity',
  '02-projects',
  '03-policies',
  '04-prompts',
];

/**
 * Try to create a file. If it already exists (409 conflict), skip silently.
 * If it exists but we need to update it (e.g. README), fetch sha and update.
 */
async function createOrSkip(path: string, content: string, message: string): Promise<void> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const encoded = Buffer.from(content, 'utf-8').toString('base64');

  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ message, content: encoded }),
  });

  if (res.ok) return;

  // 409 or 422 = file already exists — skip
  if (res.status === 409 || res.status === 422) return;

  const err = await res.text();
  throw new Error(`Failed to create ${path}: ${err}`);
}

export async function POST(req: NextRequest) {
  try {
    const { slug, name, icon, description } = await req.json();

    if (!slug || !name) {
      return NextResponse.json({ error: 'Missing slug or name' }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug — use only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    const readmeContent = [
      `# ${icon} ${name}`,
      '',
      description || '',
      '',
      '## Folders',
      '',
      '- **01-identity** — Who you are, your preferences and background',
      '- **02-projects** — Active projects and context',
      '- **03-policies** — Rules and guidelines for AI interactions',
      '- **04-prompts** — Reusable prompt templates',
    ].join('\n');

    // Create files sequentially to avoid SHA race conditions
    await createOrSkip(
      `memory/${slug}/README.md`,
      readmeContent,
      `Create ${name} memory vault`
    );

    for (const folder of FOLDERS) {
      await createOrSkip(
        `memory/${slug}/${folder}/.gitkeep`,
        '',
        `Scaffold ${folder} folder for ${name}`
      );
    }

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
