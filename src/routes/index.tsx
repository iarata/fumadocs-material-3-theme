import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from '@/components/m3e/layout';
import { baseOptions } from '@/lib/layout.shared';
import { Button } from '@/components/ui/button';
import { useAppLink } from '@/components/m3e/link';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const onClick = useAppLink('/docs');
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col flex-1 justify-center px-4 py-8 text-center">
        <h1 className="docs-hero-title m3-display-small md:m3-display-medium mb-4">Material 3 docs, built on Fumadocs.</h1>
        <Button href="/docs" role="link" variant="filled" onClickCapture={onClick} className="mx-auto">
          Open Docs
        </Button>
      </div>
    </HomeLayout>
  );
}
