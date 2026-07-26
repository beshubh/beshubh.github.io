function VoiceVisual() {
  return (
    <div className="voice-system" role="img" aria-label="An external caller reaches a client's number and a LimeChat voice agent handles the conversation">
      <svg viewBox="0 0 820 430" aria-hidden="true">
        <g className="voice-paths">
          <path d="M92 217H260" />
          <path d="M320 217H478" />
          <path d="M538 217H714" />
          <path className="voice-return" d="M714 249H538M478 249H320M260 249H92" />
        </g>
        <g className="voice-node voice-node--caller">
          <circle cx="72" cy="233" r="46" />
          <circle cx="72" cy="219" r="11" />
          <path d="M45 256c7-27 47-27 54 0" />
          <text x="72" y="305">EXTERNAL USER</text>
          <text className="voice-node-state" x="72" y="323">CALLING</text>
        </g>
        <g className="voice-node voice-node--client">
          <rect x="260" y="176" width="60" height="114" rx="3" />
          <rect x="271" y="189" width="38" height="70" rx="1" />
          <circle cx="290" cy="274" r="4" />
          <text x="290" y="325">CLIENT NUMBER</text>
        </g>
        <g className="voice-node voice-node--bridge">
          <rect x="478" y="182" width="60" height="102" />
          <path d="M490 205h36M490 218h36M490 231h36M490 244h36" />
          <text x="508" y="325">LIMECHAT BRIDGE</text>
        </g>
        <g className="voice-node voice-node--agent">
          <circle cx="742" cy="233" r="52" />
          <path d="M714 222h56M722 210v45M734 198v69M746 205v56M758 214v39" />
          <text x="742" y="313">VOICE AGENT</text>
          <text className="voice-node-state" x="742" y="331">HANDLING CALL</text>
        </g>
        <circle className="voice-packet voice-packet--out" cx="92" cy="217" r="5" />
        <circle className="voice-packet voice-packet--back" cx="714" cy="249" r="5" />
        <g className="voice-rings">
          <circle cx="742" cy="233" r="68" /><circle cx="742" cy="233" r="82" />
        </g>
      </svg>
      <div className="mobile-system-key" aria-hidden="true">
        <span>01 / EXTERNAL CALLER</span>
        <span>02 / CLIENT NUMBER</span>
        <span>03 / LIMECHAT BRIDGE</span>
        <span>04 / VOICE AGENT</span>
      </div>
      <div className="voice-caption">
        <span>01 / WHATSAPP WEBRTC</span><span>02 / RUST MEDIA BRIDGE</span><span>03 / LIVEKIT + AI</span>
      </div>
    </div>
  );
}

function UmsVisual() {
  const paths = [
    { from: [116, 92], to: [400, 230], delay: "0s" },
    { from: [116, 230], to: [400, 230], delay: "-1.2s" },
    { from: [116, 368], to: [400, 230], delay: "-2.4s" },
    { from: [684, 92], to: [400, 230], delay: "-.6s" },
    { from: [684, 230], to: [400, 230], delay: "-1.8s" },
    { from: [684, 368], to: [400, 230], delay: "-3s" },
  ];

  return (
    <div className="ums-system" role="img" aria-label="Multiple LimeChat products and external channels exchange data through the Unified Messages System">
      <svg viewBox="0 0 800 470" aria-hidden="true">
        <g className="ums-links">
          {paths.map(({ from, to }, index) => <path key={index} d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} />)}
        </g>
        <g className="ums-side-labels">
          <text x="116" y="31">LIMECHAT / INTERNAL</text>
          <text x="684" y="31">EXTERNAL WORLD</text>
        </g>
        {[
          [116, 92, "CRM"],
          [116, 230, "WORKFLOWS"],
          [116, 368, "AGENTS"],
          [684, 92, "WHATSAPP"],
          [684, 230, "INSTAGRAM"],
          [684, 368, "WEB / APIs"],
        ].map(([x, y, label]) => (
          <g className="ums-node" key={label}>
            <rect x={x - 66} y={y - 31} width="132" height="62" />
            <circle cx={x - 48} cy={y} r="4" />
            <text x={x + 8} y={y + 4}>{label}</text>
          </g>
        ))}
        <g className="ums-core">
          <circle cx="400" cy="230" r="88" />
          <circle cx="400" cy="230" r="64" />
          <text x="400" y="222">UNIFIED</text>
          <text x="400" y="242">MESSAGES</text>
          <text x="400" y="262">SYSTEM</text>
        </g>
        {paths.map(({ from, to, delay }, index) => (
          <circle className="ums-packet" r="5" key={`in-${index}`} style={{ "--delay": delay }}>
            <animate attributeName="cx" values={`${from[0]};${to[0]};${from[0]}`} dur="4.2s" begin={delay} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${from[1]};${to[1]};${from[1]}`} dur="4.2s" begin={delay} repeatCount="indefinite" />
          </circle>
        ))}
        <text className="ums-throughput" x="400" y="450">100M+ MESSAGES / 1B REQUESTS / DAY</text>
      </svg>
      <div className="mobile-system-key mobile-system-key--ums" aria-hidden="true">
        <span>INTERNAL PRODUCTS</span>
        <span>UNIFIED MESSAGES SYSTEM</span>
        <span>EXTERNAL WORLD</span>
      </div>
    </div>
  );
}

function ServerStack({ healthy = false, label }) {
  return (
    <div className={`server-state${healthy ? " server-state--healthy" : ""}`}>
      <span className="server-state__label">{label}</span>
      <div className="server-rack">
        {[0, 1, 2].map((index) => (
          <div className="server-unit" key={index}>
            <span /><i /><i /><i />
          </div>
        ))}
        {!healthy ? (
          <div className="flames" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        ) : (
          <div className="health-pulse" aria-hidden="true"><i /><i /><i /></div>
        )}
      </div>
      <dl>
        <div><dt>QUEUE</dt><dd>{healthy ? "ROUTABLE" : "SATURATED"}</dd></div>
        <div><dt>DB</dt><dd>{healthy ? "PROTECTED" : "OVERLOADED"}</dd></div>
        <div><dt>RECOVERY</dt><dd>{healthy ? "AUTOMATIC" : "MANUAL"}</dd></div>
      </dl>
    </div>
  );
}

function ReliabilityVisual() {
  return (
    <div className="reliability-system" role="img" aria-label="Overloaded systems on fire become stable and self-protecting after the reliability initiative">
      <ServerStack label="BEFORE / CASCADE" />
      <div className="reliability-change">
        <span>CIRCUIT BREAKERS</span>
        <span>FALLBACK QUEUES</span>
        <span>RESOURCE GUARDS</span>
        <i>→</i>
      </div>
      <ServerStack healthy label="AFTER / CONTAINED" />
    </div>
  );
}

export function ProofVisual({ type }) {
  if (type === "voice") return <VoiceVisual />;
  if (type === "ums") return <UmsVisual />;
  if (type === "reliability") return <ReliabilityVisual />;
  return null;
}
