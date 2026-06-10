interface WhatsAppIconProps {
  className?: string;
}

/** Official-style WhatsApp mark (green bubble + handset) */
export default function WhatsAppIcon({ className = "h-4 w-4" }: WhatsAppIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/whatsapp.svg"
      alt=""
      aria-hidden
      className={`shrink-0 ${className}`}
    />
  );
}
