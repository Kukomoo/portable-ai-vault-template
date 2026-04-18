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

function buildStarterTemplate(name: string, icon: string, description: string): string {
  return [
    `# ${icon} ${name}`,
    '',
    description ? `> ${description}` : `> Your AI memory space for ${name}.`,
    '',
    '---',
    '',
    '## 💡 What is this file?',
    '',
    'This is a **Markdown file** — a simple way to write formatted notes that any AI (ChatGPT, Claude, Gemini, etc.) can read and understand.',
    '',
    'You can copy the content of any file in this vault and paste it directly into an AI chat to give it context about you.',
    '',
    '---',
    '',
    '## ✏️ How to write in Markdown (it\'s easy!)',
    '',
    'Markdown just uses a few special characters to add formatting. Here are all the basics:',
    '',
    '### Headings',
    '',
    'Use `#` symbols to create titles. More `#` = smaller heading.',
    '',
    '```',
    '# Big title',
    '## Smaller title',
    '### Even smaller',
    '```',
    '',
    '### Bold and italic',
    '',
    '```',
    '**This text is bold**',
    '*This text is italic*',
    '***This is both***',
    '```',
    '',
    '**This text is bold**',
    '*This text is italic*',
    '',
    '### Bullet lists',
    '',
    '```',
    '- First item',
    '- Second item',
    '  - Indented sub-item',
    '```',
    '',
    '- First item',
    '- Second item',
    '  - Indented sub-item',
    '',
    '### Numbered lists',
    '',
    '```',
    '1. Step one',
    '2. Step two',
    '3. Step three',
    '```',
    '',
    '1. Step one',
    '2. Step two',
    '3. Step three',
    '',
    '### Highlight (inline code)',
    '',
    'Wrap text in backticks to highlight it: `like this`',
    '',
    '### Divider line',
    '',
    'Three dashes on their own line creates a divider:',
    '',
    '```',
    '---',
    '```',
    '',
    '### Links',
    '',
    '```',
    '[Link text](https://example.com)',
    '```',
    '',
    '---',
    '',
    '## 🚀 Start adding your content below',
    '',
    `Write anything about **${name}** here. The more context you add, the more useful this memory becomes when pasted into an AI.`,
    '',
    '### My preferences',
    '',
    '- ',
    '',
    '### Important context',
    '',
    '- ',
    '',
    '### Notes',
    '',
    '- ',
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { name, icon, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const repoName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!repoName) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    // 1. Create the repo (auto_init creates a default README we'll replace)
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: repoName,
        description: `${icon} ${description || name}`,
        private: false,
        auto_init: true,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      if (createRes.status === 422) {
        return NextResponse.json({ error: 'A memory with that name already exists.' }, { status: 409 });
      }
      throw new Error(err.message || 'Failed to create repo');
    }

    const repo = await createRes.json() as { name: string; full_name: string };

    // 2. Tag it as an ai-memory-vault
    await fetch(
      `https://api.github.com/repos/${repo.full_name}/topics`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ names: ['ai-memory-vault'] }),
      }
    );

    // 3. Get the SHA of the auto-generated README so we can replace it
    const readmeRes = await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/README.md`,
      { headers: authHeaders, cache: 'no-store' }
    );
    const readmeData = await readmeRes.json() as { sha: string };

    // 4. Replace README.md with a minimal internal metadata file (hidden from UI)
    const metaContent = [
      `vault_name: ${name}`,
      `vault_icon: ${icon}`,
      `vault_description: ${description || ''}`,
    ].join('\n');
    const metaEncoded = Buffer.from(metaContent, 'utf-8').toString('base64');

    await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/README.md`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          message: `Init ${name} vault`,
          content: metaEncoded,
          sha: readmeData.sha,
        }),
      }
    );

    // 5. Create the starter file with the friendly Markdown template
    const starterContent = buildStarterTemplate(name, icon, description || '');
    const starterEncoded = Buffer.from(starterContent, 'utf-8').toString('base64');

    await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/getting-started.md`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          message: `Add getting started guide for ${name}`,
          content: starterEncoded,
        }),
      }
    );

    return NextResponse.json({ success: true, slug: repoName });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
