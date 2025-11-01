"use client";
import { useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import { buildPrompt, type OutputType, type PromptInputs, type RiskProfile } from '@/lib/promptTemplates';

const allMarkets = [
  'Match Result (1X2)',
  'Over/Under 2.5',
  'Both Teams To Score',
  'Asian Handicap',
  'Corners',
  'Cards',
  'Shots on Target',
];

const outputTypes: OutputType[] = [
  'Analysis',
  'Value Bet Finder',
  'Same-Game Parlay',
  'In-Play Strategy',
  'Bankroll Plan',
];

const languages = [
  'English',
  'Spanish',
  'Portuguese',
  'French',
  'German',
  'Italian',
];

const risks: RiskProfile[] = ['Conservative', 'Moderate', 'Aggressive'];

export default function PromptBuilder() {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [league, setLeague] = useState('');
  const [kickoff, setKickoff] = useState('');
  const [risk, setRisk] = useState<RiskProfile>('Moderate');
  const [language, setLanguage] = useState('English');
  const [markets, setMarkets] = useState<string[]>(['Match Result (1X2)', 'Over/Under 2.5']);
  const [type, setType] = useState<OutputType>('Analysis');
  const [oddsHome, setOddsHome] = useState('');
  const [oddsDraw, setOddsDraw] = useState('');
  const [oddsAway, setOddsAway] = useState('');
  const [context, setContext] = useState('');

  const inputs: PromptInputs = useMemo(() => ({
    homeTeam,
    awayTeam,
    league,
    kickoff,
    marketPreferences: markets,
    risk,
    language,
    odds: { home: oddsHome, draw: oddsDraw, away: oddsAway },
    additionalContext: context,
  }), [homeTeam, awayTeam, league, kickoff, markets, risk, language, oddsHome, oddsDraw, oddsAway, context]);

  const prompt = useMemo(() => buildPrompt(inputs, type), [inputs, type]);

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      homeTeam, awayTeam, league, kickoff, risk, language, type,
      oddsHome, oddsDraw, oddsAway,
      markets: JSON.stringify(markets),
      context,
    });
    return `${typeof window !== 'undefined' ? window.location.origin : ''}?${params.toString()}`;
  }, [homeTeam, awayTeam, league, kickoff, risk, language, type, oddsHome, oddsDraw, oddsAway, markets, context]);

  // Load prefilled state from URL (once)
  useState(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const q = url.searchParams;
    setHomeTeam(q.get('homeTeam') || '');
    setAwayTeam(q.get('awayTeam') || '');
    setLeague(q.get('league') || '');
    setKickoff(q.get('kickoff') || '');
    setRisk((q.get('risk') as RiskProfile) || 'Moderate');
    setLanguage(q.get('language') || 'English');
    setType((q.get('type') as OutputType) || 'Analysis');
    setOddsHome(q.get('oddsHome') || '');
    setOddsDraw(q.get('oddsDraw') || '');
    setOddsAway(q.get('oddsAway') || '');
    const m = q.get('markets');
    if (m) {
      try { setMarkets(JSON.parse(m)); } catch { /* ignore */ }
    }
    setContext(q.get('context') || '');
  });

  const toggleMarket = (name: string) => {
    setMarkets(prev => prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]);
  };

  return (
    <section className="card">
      <div className="grid">
        <div className="field">
          <label htmlFor="homeTeam">Home team</label>
          <input id="homeTeam" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} placeholder="Arsenal" />
        </div>
        <div className="field">
          <label htmlFor="awayTeam">Away team</label>
          <input id="awayTeam" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} placeholder="Manchester City" />
        </div>
        <div className="field">
          <label htmlFor="league">League</label>
          <input id="league" value={league} onChange={e => setLeague(e.target.value)} placeholder="Premier League" />
        </div>
        <div className="field">
          <label htmlFor="kickoff">Kickoff (local)</label>
          <input id="kickoff" value={kickoff} onChange={e => setKickoff(e.target.value)} placeholder="2025-11-05 20:00" />
        </div>
        <div className="field">
          <label htmlFor="risk">Risk profile</label>
          <select id="risk" value={risk} onChange={e => setRisk(e.target.value as RiskProfile)}>
            {risks.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="language">Language</label>
          <select id="language" value={language} onChange={e => setLanguage(e.target.value)}>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="section-title">Odds (optional)</div>
      <div className="grid">
        <div className="field">
          <label htmlFor="oddsHome">Home</label>
          <input id="oddsHome" value={oddsHome} onChange={e => setOddsHome(e.target.value)} placeholder="2.10" />
        </div>
        <div className="field">
          <label htmlFor="oddsDraw">Draw</label>
          <input id="oddsDraw" value={oddsDraw} onChange={e => setOddsDraw(e.target.value)} placeholder="3.40" />
        </div>
        <div className="field">
          <label htmlFor="oddsAway">Away</label>
          <input id="oddsAway" value={oddsAway} onChange={e => setOddsAway(e.target.value)} placeholder="3.20" />
        </div>
      </div>

      <div className="section-title">Focus markets</div>
      <div className="row">
        {allMarkets.map(m => (
          <label key={m} className="row" style={{ gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={markets.includes(m)} onChange={() => toggleMarket(m)} /> {m}
          </label>
        ))}
      </div>

      <div className="section-title">Output type</div>
      <div className="field">
        <select value={type} onChange={e => setType(e.target.value as OutputType)}>
          {outputTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="helper">Choose the style of prompt you want to generate.</div>
      </div>

      <div className="section-title">Additional context</div>
      <div className="field">
        <textarea value={context} onChange={e => setContext(e.target.value)} placeholder="Injuries, suspensions, recent xG, weather, fixture congestion, tactical notes..." />
      </div>

      <div className="section-title">Generated prompt</div>
      <div className="field">
        <div className="actions">
          <CopyButton text={prompt} />
          <a className="secondary" href={`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`} target="_blank" rel="noreferrer">
            <button type="button" className="secondary">Open in ChatGPT</button>
          </a>
          <a className="secondary" href={shareUrl}>
            <button type="button" className="secondary">Share Link</button>
          </a>
        </div>
        <div className="output" aria-live="polite">{prompt}</div>
      </div>
    </section>
  );
}
