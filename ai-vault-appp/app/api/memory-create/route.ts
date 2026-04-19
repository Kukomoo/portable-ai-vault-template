// app/api/memory-create/route.ts
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
    `# ${name}`,
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
    '### Headings',
    'Use `#` symbols to create titles. More `#` = smaller heading.',
    '',
    '### Bold and italic',
    '**This text is bold** and *this text is italic*',
    '',
    '### Bullet lists',
    '- First item',
    '- Second item',
    '  - Indented sub-item',
    '',
    '### Numbered lists',
    '1. Step one',
    '2. Step two',
    '',
    '### Divider line — three dashes: ---',
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

    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

    const repoName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!repoName) return NextResponse.json({ error: 'Invalid name' }, { status: 400 });

    // ✅ Save icon in [iconId] format so parseVaultMeta can detect it
    const repoDescription = `[${icon}] ${description || name}`;

    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: repoName,
        description: repoDescription,
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

    // Tag as ai-memory-vault
    await fetch(`https://api.github.com/repos/${repo.full_name}/topics`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ names: ['ai-memory-vault'] }),
    });

    // Get README SHA
    const readmeRes = await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/README.md`,
      { headers: authHeaders, cache: 'no-store' }
    );
    const readmeData = await readmeRes.json() as { sha: string };

    // Replace README with metadata
    const metaContent = [
      `vault_name: ${name}`,
      `vault_icon: ${icon}`,
      `vault_description: ${description || ''}`,
    ].join('\n');

    await fetch(`https://api.github.com/repos/${repo.full_name}/contents/README.md`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        message: `Init ${name} vault`,
        content: Buffer.from(metaContent, 'utf-8').toString('base64'),
        sha: readmeData.sha,
      }),
    });

    // Create starter file
    await fetch(`https://api.github.com/repos/${repo.full_name}/contents/getting-started.md`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        message: `Add getting started guide for ${name}`,
        content: Buffer.from(buildStarterTemplate(name, icon, description || ''), 'utf-8').toString('base64'),
      }),
    });

    return NextResponse.json({ success: true, slug: repoName });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}