import UnavailableModal from '../base/UnavailableModal';
import { useEffect } from 'react';

export default function SemaphorePage() {
  useEffect(() => {
    document.title = "System Zero | Semaphore"; 

    return () => {
      document.title = "System Zero | Interactive Computer Architecture and OS Simulator";
    }
  }, []);
  return <UnavailableModal featureName="Counting Semaphore" />;
}
