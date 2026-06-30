export default function BackgroundWave() {
  return (
    <svg
      className="bg-wave"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="1920" height="1080" fill="#fbf7ef" />
      <path
        d="M0,0 H520 C460,260 600,430 470,620 C360,790 480,950 380,1080 H0 Z"
        fill="#cfe9e4"
        opacity="0.9"
      />
      <path
        d="M0,1080 C220,950 160,820 320,760 C470,700 420,560 300,470 L0,470 Z"
        fill="#a9dcd4"
        opacity="0.6"
      />
    </svg>
  );
}
