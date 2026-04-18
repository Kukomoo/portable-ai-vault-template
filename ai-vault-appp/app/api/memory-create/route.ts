// app/api/memory-create/route.ts
// Creates a new GitHub repo as an AI memory vault
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

export async function POST(req: NextRequest) {
  try {
    const { name, icon, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    // Convert name to a valid repo slug
    const repoName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!repoName) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    // 1. Create the repo
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: repoName,
        description: `${icon} ${description || name}`,
        private: false,
        auto_init: true, // creates a default README
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      // 422 = repo already exists
      if (createRes.status === 422) {
        return NextResponse.json({ error: 'A memory with that name already exists.' }, { status: 409 });
      }
      throw new Error(err.message || 'Failed to create repo');
    }

    const repo = await createRes.json() as { name: string; full_name: string };

    // 2. Add the ai-memory-vault topic so the app can find it
    await fetch(
      `https://api.github.com/repos/${repo.full_name}/topics`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ names: ['ai-memory-vault'] }),
      }
    );

    // 3. Overwrite the README with a proper vault template
    // First get the SHA of the auto-generated README
    const readmeRes = await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/README.md`,
      { headers: authHeaders, cache: 'no-store' }
    );
    const readmeData = await readmeRes.json() as { sha: string };

    const readmeContent = [
      `# ${icon} ${name}`,
      '',
      description || `An AI memory vault for ${name}.`,
      '',
      '## How to use',
      '',
      'Add Markdown files to this repo. Each file becomes a piece of context you can copy into any AI conversation.',
    ].join('\n');

    const encoded = Buffer.from(readmeContent, 'utf-8').toString('base64');
    await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/README.md`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          message: `Init ${name} memory vault`,
          content: encoded,
          sha: readmeData.sha,
        }),
      }
    );

    return NextResponse.json({ success: true, slug: repoName });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
