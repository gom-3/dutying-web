import { useEffect, useState } from 'react';
import { isMobile } from 'is-mobile';
import MobileLanding from './components/MobileLanding';
import WebLanding from './components/WebLanding';

function LandingPage() {
  const mobile = isMobile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (new Date() < new Date('2023-11-22')) {
      setOpen(true);
    }
  }, []);

  return mobile ? (
    <MobileLanding open={open} onClose={() => setOpen(false)} />
  ) : (
    <WebLanding open={open} onClose={() => setOpen(false)} />
  );
}

export default LandingPage;
