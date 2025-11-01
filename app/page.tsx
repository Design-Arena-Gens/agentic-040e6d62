import PromptBuilder from '@/components/PromptBuilder';

export default function Page() {
  return (
    <main className="container">
      <header className="header">
        <h1>Soccer Betting Prompt Builder</h1>
        <p>Craft high-signal prompts for match analysis, value bets, and parlays.</p>
      </header>
      <PromptBuilder />
      <footer className="footer">
        <span>Built for fast deployment on Vercel</span>
      </footer>
    </main>
  );
}
