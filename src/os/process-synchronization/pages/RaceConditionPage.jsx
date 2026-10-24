import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RaceConditionSimulator from '../base/RaceConditionSimulator';

export default function RaceConditionPage() {
  return (
    <RaceConditionSimulator>
      <Link
        to="/os/sync#petersons-solution"
        className="continue-reading-btn"
        title="Continue to Peterson's Solution section"
      >
        <span>Continue Reading: Peterson&apos;s Solution</span>
        <ArrowRight size={15} />
      </Link>
    </RaceConditionSimulator>
  );
}
