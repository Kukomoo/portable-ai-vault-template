// app/api/memory-create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

// Standard folder structure for every new memory vault
const FOLDERS = [
  '01-identity',
  '02-projects',
  '03-policies',
  '04-prompts',
];

export async function POST(req: NextRequest) {
  try {
    const { slug, name, icon, description } = await req.json();

    if (!slug || !name) {
      return NextResponse.json({ error: 'Missing slug or name' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug — use only lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    // Create a README in the memory root with metadata
    const readmeContent = [
      `# ${icon} ${name}`,
      '',
      description ? `${description}` : '',
      '',
      '## Folders',
      '',
      '- **01-identity** — Who you are, your preferences and background',
      '- **02-projects** — Active projects and context',
      '- **03-policies** — Rules and guidelines for AI interactions',
      '- **04-prompts** — Reusable prompt templates',
    ].join('\n');

    // Create the README and .gitkeep files for each folder in parallel
    await Promise.all([
      createFile(
        `memory/${slug}/README.md`,
        readmeContent,
        `Create ${name} memory vault`
      ),
      ...FOLDERS.map((folder) =>
        createFile(
          `memory/${slug}/${folder}/.gitkeep`,
          '',
          `Scaffold ${folder} folder for ${name}`
        )
      ),
    ]);

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
