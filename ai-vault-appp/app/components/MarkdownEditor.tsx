{/* Content pane */}
{mode === 'view' ? (
  <div className="grid grid-cols-2 divide-x divide-[#e7e5e4] min-h-[500px]">
    {/* Editor */}
    <div className="flex flex-col">
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 bg-neutral-50 border-b border-[#e7e5e4]">
        Markdown
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none p-4 font-mono text-xs text-neutral-800 focus:outline-none bg-white leading-relaxed"
        placeholder="Write markdown here..."
      />
    </div>
  </div>
) : null}