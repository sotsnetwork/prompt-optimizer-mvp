
interface PromptCardProps {
  title: string;
  content: string;
  isLoading?: boolean;
}

export function PromptCard({ title, content, isLoading }: PromptCardProps) {
  return (
    <div className="card-primary min-h-[200px]">
      <h3 className="text-lg font-semibold app-text-primary mb-4">{title}</h3>
      <div className="app-surface-secondary rounded-xl p-4 min-h-[140px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[hsl(var(--app-accent))] border-t-transparent"></div>
          </div>
        ) : (
          <p className="app-text-primary leading-relaxed whitespace-pre-wrap">
            {content || "Enter a prompt to see results..."}
          </p>
        )}
      </div>
    </div>
  );
}
