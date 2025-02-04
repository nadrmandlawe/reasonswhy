import { ReasonPageContent } from '@/components/ReasonPageContent';

export default async function ReasonPage(params: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params.params;
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <ReasonPageContent reasonId={id} />
    </div>
  );
} 