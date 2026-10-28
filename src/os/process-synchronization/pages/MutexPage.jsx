import UnavailableModal from '../base/UnavailableModal';
import { useEffect } from 'react';

export default function MutexPage() {
  useEffect(() => {
    document.title = "System Zero | Mutex Lock"; 

    return () => {
      document.title = "System Zero | Interactive Computer Architecture and OS Simulator";
    }
  }, []);
  return <UnavailableModal featureName="Mutex Lock" />;
}
