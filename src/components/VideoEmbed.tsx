"use client";

import { useState } from "react";

/**
 * Two-click embed: nothing is loaded from YouTube/Vimeo until the visitor presses the button.
 * That keeps visitors' IP addresses and cookies away from those companies unless they choose.
 */
export function VideoEmbed({
  src,
  title,
  watchUrl,
  providerName,
}: {
  src: string;
  title: string;
  watchUrl: string;
  providerName: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <div className="video-frame">
      {on ? (
        <iframe
          src={src}
          title={title}
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      ) : (
        <div className="video-gate">
          <div>
            <p>
              This video is hosted by {providerName}. If you play it, {providerName} will receive your
              IP address and may set cookies on your device.
            </p>
            <button type="button" className="btn" onClick={() => setOn(true)}>
              Play video from {providerName}
            </button>
            <p>
              <a href={watchUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#ffd3e1" }}>
                Or watch on {providerName}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
