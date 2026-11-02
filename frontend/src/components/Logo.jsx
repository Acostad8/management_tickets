import clsx from 'clsx';

export function LogoMark({ size = 24, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.75"  y="2.75"  width="8.5" height="8.5" rx="1.75" fill="currentColor" />
      <rect x="12.75" y="2.75"  width="8.5" height="8.5" rx="1.75" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" fill="none" />
      <rect x="2.75"  y="12.75" width="8.5" height="8.5" rx="1.75" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" fill="none" />
      <rect x="12.75" y="12.75" width="8.5" height="8.5" rx="1.75" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" fill="none" />
    </svg>
  );
}

export function Logo({ size = 22, className, variant = 'default' }) {
  const colorMark = variant === 'brand' ? 'text-brand-500' : 'text-zinc-100';
  const subtitle  = variant === 'brand' ? 'text-brand-300/70' : 'text-zinc-500';
  const title     = variant === 'brand' ? 'text-zinc-50' : 'text-zinc-100';

  return (
    <div className={clsx('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} className={colorMark} />
      <span className="text-[13px] font-medium leading-none tracking-tight">
        <span className={title}>Sistemas Integrados</span>{' '}
        <span className={subtitle}>S.A.</span>
      </span>
    </div>
  );
}
