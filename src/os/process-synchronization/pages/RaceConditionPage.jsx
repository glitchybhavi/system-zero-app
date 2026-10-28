import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RaceConditionSimulator from '../base/RaceConditionSimulator';
import { useEffect } from 'react';

export default function RaceConditionPage() {

  useEffect(() => {
    document.title = "System Zero | Race Condition"; 

    return () => {
      document.title = "System Zero | Interactive Computer Architecture and OS Simulator";
    }
  }, []);

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
