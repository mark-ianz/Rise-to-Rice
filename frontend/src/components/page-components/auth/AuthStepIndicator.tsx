import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type Step = {
  key: string;
  label: string;
};

type Props = {
  currentStep: string;
  steps: Step[];
  onStepClick?: (stepKey: string) => void;
  maxReachedStep?: string;
};

export default function AuthStepIndicator({
  currentStep,
  steps,
  onStepClick,
  maxReachedStep,
}: Props) {
  const { t } = useTranslation("register");
  const currentIndex = steps.findIndex((step) => step.key === currentStep);
  const maxReachedIndex = maxReachedStep 
    ? steps.findIndex((step) => step.key === maxReachedStep)
    : currentIndex;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {steps.map((step, index) => {
        const isCompleted = currentIndex > index;
        const isCurrent = currentIndex === index;
        const isAccessible = index <= maxReachedIndex;

        return (
          <div
            key={step.key}
            onClick={() => isAccessible && !isCurrent && onStepClick?.(step.key)}
            className={cn(
              "flex flex-1 items-center gap-4 rounded-xl border px-4 py-3 transition-colors duration-200",
              isAccessible && !isCurrent && "cursor-pointer hover:border-primary-main/50",
              isCurrent &&
                "border-primary-main ring-1 ring-primary-main bg-white",
              (isCompleted || (isAccessible && !isCurrent)) &&
                "border-gray-200 bg-gray-50",
              !isCurrent &&
                !isCompleted &&
                !isAccessible &&
                "border-gray-200 bg-white"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200",
                isCurrent && "bg-primary-main text-white",
                isCompleted && "bg-primary-main text-white",
                !isCurrent && !isCompleted && "bg-gray-100 text-gray-500"
              )}
            >
              {isCompleted ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider mb-0.5",
                  isCurrent ? "text-primary-main" : "text-gray-400"
                )}
              >
                {t ? t("step") : "Step"} {index + 1}
              </p>
              <p className={cn(
                "truncate text-sm font-medium",
                isCurrent ? "text-gray-900" : "text-gray-500"
              )}>
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
