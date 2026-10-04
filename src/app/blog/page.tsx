import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogIndex() {
  const blogDir = path.resolve(process.cwd(), 'content/blog');
  let posts: { slug: string, title: string }[] = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    posts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
        const titleMatch = content.match(/^#\s+(.*)/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
        return { slug: file.replace('.md', ''), title };
      });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <div className="max-w-4xl mx-auto py-24 px-6">
        <h1 className="text-5xl font-black mb-4">VocalAI Insights</h1>
        <p className="text-xl text-slate-400 mb-12">Strategies, automation secrets, and case studies for scaling home service businesses.</p>
        
        <div className="grid gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
              <h2 className="text-2xl font-bold mb-2 text-white">{post.title}</h2>
              <p className="text-blue-400 font-semibold flex items-center">Read Article &rarr;</p>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-500 italic">The CMO Agent is writing the first post...</p>
          )}
        </div>
      </div>
    </div>
  );
}
