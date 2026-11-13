/**
 * Original, hand-drawn awareness ribbon (a plain loop-and-tails shape).
 * It is decorative, so it is hidden from assistive technology.
 * It is NOT any organisation's logo. Do not replace it with a copied logo.
 */
export function Ribbon({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 130"
      width={size}
      height={size * 1.3}
      aria-hidden="true"
      focusable="false"
      className="ribbon-art"
      style={{ margin: 0 }}
    >
      <path
        className="ribbon-draw"
        d="M50 8c-20 0-32 14-32 30 0 14 10 24 18 36l-14 46 20-14 8 20 8-20 20 14-14-46c8-12 18-22 18-36C82 22 70 8 50 8z"
        fill="#f6cfdb"
        stroke="#a3174f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M50 8c-14 14-14 40 0 66 14-26 14-52 0-66z"
        fill="none"
        stroke="#a3174f"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
