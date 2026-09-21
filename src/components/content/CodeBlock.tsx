import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang: string;
  caption?: string;
}

export async function CodeBlock({ code, lang, caption }: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <figure className="grid gap-2">
      <div
        className="overflow-x-auto rounded-xl border border-line bg-sunken p-4 text-sm [&_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption ? <figcaption className="text-xs text-faint">{caption}</figcaption> : null}
    </figure>
  );
}
