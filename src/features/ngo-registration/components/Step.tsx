interface StepProps {
    step: string;
    title: string;
    subtitle: string;
    active?: boolean;
}
export const Step:React.FC<StepProps>=({ step, title, subtitle, active = false })=> {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
          active ? "bg-primary text-white" : "bg-input text-primaryText"
        }`}
      >
        <p>{step}</p>
      </div>
      {step!='3' && (
          <div className="w-0.5 h-20 bg-border mt-0.5" />
        )}
      </div>
      <div>
        <p className={`text-sm font-semibold ${active ? "text-primary" : ""}`}>
          {title}
        </p>
        <p className="text-xs text-primaryText">{subtitle}</p>
      </div>
    </div>
  ); 
}
