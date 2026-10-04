import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.resolve(process.cwd(), `content/blog/${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-500">Article not found.</h1>
      </div>
    );
  }

  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const htmlContent = marked(rawContent);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500">
      <nav className="border-b border-slate-800 p-6 max-w-4xl mx-auto">
        <Link href="/blog" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center">
          &larr; Back to Insights
        </Link>
      </nav>
      
      <article className="max-w-3xl mx-auto py-16 px-6 prose prose-invert prose-blue lg:prose-xl prose-headings:text-white prose-a:text-blue-400">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>

      <section className="bg-slate-900 border-t border-slate-800 py-16 mt-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-white mb-4">Stop Missing Calls.</h3>
          <p className="text-slate-400 mb-8">Deploy an AI Receptionist for your business today.</p>
          <Link href="/demo" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition shadow-lg shadow-blue-500/25">
            View Live Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
