// Detailed explanations for each phase
const phaseExplanations = {
  'User types google.com': {
    title: 'User Input',
    phase: 1,
    color: '#3b82f6',
    description:
      "When you type 'google.com' in your browser's address bar and press Enter, the browser initiates a complex series of network operations.",
    details: [
      'Browser parses the URL to extract the protocol (HTTPS), domain (google.com), and path',
      'Checks browser cache for recently resolved DNS entries',
      'If not cached, prepares to perform a DNS lookup',
    ],
    icon: '⌨️',
  },
  'Browser creates HTTP request': {
    title: 'HTTP Request Creation',
    phase: 1,
    color: '#3b82f6',
    description:
      'The browser constructs an HTTP request with headers, cookies, and other metadata.',
    details: [
      'Sets request method (GET for page loads)',
      'Adds User-Agent, Accept-Language, and other headers',
      'Includes any cookies for the domain',
    ],
    icon: '📝',
  },
  'ARP: Who has 192.168.1.1?': {
    title: 'ARP Request',
    phase: 1,
    color: '#f97316',
    description:
      'Before sending to the router, your device needs its MAC (hardware) address using ARP.',
    details: [
      'ARP = Address Resolution Protocol',
      'Broadcasts "Who has IP 192.168.1.1?" to all devices on local network',
      'MAC addresses are needed for Layer 2 (Data Link) communication',
      'Without the MAC, packets cannot be delivered on the local network',
    ],
    icon: '📢',
  },
  'ARP: Router MAC: AA:BB:CC:11:22:33': {
    title: 'ARP Response',
    phase: 1,
    color: '#22c55e',
    description:
      'The router responds with its MAC address, which gets cached for future use.',
    details: [
      'Router responds: "192.168.1.1 is at AA:BB:CC:11:22:33"',
      'Your device caches this in its ARP table',
      'ARP cache typically expires after 15-20 minutes',
      'Now packets can be addressed to the router',
    ],
    icon: '✓',
  },
  'Sending to Router via WiFi...': {
    title: 'Local Network',
    phase: 1,
    color: '#3b82f6',
    description:
      'Your request leaves your device and travels through your local network.',
    details: [
      'Data is converted to WiFi radio signals (802.11)',
      'Packet includes both IP address AND MAC address',
      'Router receives the packet on its LAN interface',
    ],
    icon: '📡',
  },
  'NAT: 192.168.1.5 → 203.45.67.89': {
    title: 'NAT Translation',
    phase: 1,
    color: '#eab308',
    description:
      'Network Address Translation converts your private IP to a public IP for internet routing.',
    details: [
      'Private IPs (192.168.x.x) cannot be routed on the internet',
      'NAT maps: Private IP:Port → Public IP:Port',
      'Creates entry in NAT table to track the connection',
      'Enables multiple devices to share one public IP',
    ],
    icon: '🔄',
  },
  'Router forwarding to ISP...': {
    title: 'ISP Connection',
    phase: 1,
    color: '#3b82f6',
    description:
      "Your router forwards the request to your Internet Service Provider's network.",
    details: [
      "Packet travels through copper/fiber to ISP's infrastructure",
      'ISP routes packet based on destination IP',
      'Multiple hops through ISP internal routers',
    ],
    icon: '🏢',
  },
  'Traveling through submarine cable...': {
    title: 'Submarine Cable',
    phase: 1,
    color: '#06b6d4',
    description:
      'Data crosses oceans through fiber optic cables laid on the ocean floor.',
    details: [
      'Over 400 submarine cables connect continents',
      'Light pulses travel at ~200,000 km/s through fiber',
      'Cables are only about 17mm thick but carry 99% of intercontinental data',
    ],
    icon: '🌊',
  },
  'Reaching DNS Server...': {
    title: 'DNS Server',
    phase: 2,
    color: '#8b5cf6',
    description:
      'The request reaches a DNS (Domain Name System) server to resolve the domain name.',
    details: [
      "DNS is like the internet's phone book",
      'Translates human-readable domain names to IP addresses',
      'Hierarchical system: Root → TLD → Authoritative servers',
    ],
    icon: '📖',
  },
  'DNS Query: "What is google.com?"': {
    title: 'DNS Query',
    phase: 2,
    color: '#8b5cf6',
    description:
      "Your browser asks the DNS resolver: 'What is the IP address for google.com?'",
    details: [
      'Query type: A record (IPv4) or AAAA record (IPv6)',
      'Recursive resolver checks its cache first',
      'If not cached, queries root → .com TLD → google.com authoritative server',
    ],
    icon: '❓',
  },
  'DNS Response: 142.250.190.14': {
    title: 'DNS Response',
    phase: 2,
    color: '#8b5cf6',
    description: "DNS server responds with google.com's IP address.",
    details: [
      'Response includes IP address(es) and TTL (Time To Live)',
      'TTL tells browsers how long to cache this result',
      'Multiple IPs may be returned for load balancing',
    ],
    icon: '✅',
  },
  'Initiating TCP connection...': {
    title: 'TCP Connection',
    phase: 3,
    color: '#f97316',
    description:
      'Before sending data, a reliable TCP connection must be established.',
    details: [
      'TCP ensures reliable, ordered delivery of data',
      'Uses port 443 for HTTPS (port 80 for HTTP)',
      'Connection is full-duplex (bidirectional)',
    ],
    icon: '🔗',
  },
  'TCP: Sending SYN packet →': {
    title: 'SYN - Step 1 of 3',
    phase: 3,
    color: '#f97316',
    description:
      'Client sends SYN (synchronize) packet to initiate connection.',
    details: [
      'SYN flag is set to 1',
      'Client picks a random initial sequence number',
      "Says: 'I want to connect, starting at sequence X'",
    ],
    icon: '1️⃣',
  },
  'TCP: Received SYN-ACK ←': {
    title: 'SYN-ACK - Step 2 of 3',
    phase: 3,
    color: '#f97316',
    description: 'Server acknowledges and sends its own synchronization.',
    details: [
      'Server sets both SYN and ACK flags',
      "Acknowledges client's sequence + 1",
      "Says: 'OK, I acknowledge X+1, my sequence starts at Y'",
    ],
    icon: '2️⃣',
  },
  'TCP: Sending ACK → Connected!': {
    title: 'ACK - Step 3 of 3',
    phase: 3,
    color: '#22c55e',
    description:
      'Client acknowledges server, completing the three-way handshake.',
    details: [
      'ACK flag set, acknowledges server sequence + 1',
      'Connection is now ESTABLISHED',
      'Both parties can now send data',
    ],
    icon: '3️⃣',
  },
  'Starting SSL/TLS Handshake...': {
    title: 'SSL/TLS Handshake',
    phase: 4,
    color: '#ec4899',
    description:
      'On top of TCP, TLS creates an encrypted tunnel for secure communication.',
    details: [
      'TLS 1.3 is the current standard (TLS 1.2 still common)',
      'Ensures confidentiality, integrity, and authentication',
      'Uses asymmetric crypto for key exchange, symmetric for data',
    ],
    icon: '🔐',
  },
  'SSL: Client Hello →': {
    title: 'Client Hello',
    phase: 4,
    color: '#ec4899',
    description: 'Client announces supported TLS versions and cipher suites.',
    details: [
      'Sends supported TLS versions (1.2, 1.3)',
      'Lists cipher suites in preference order',
      'Includes a random number for key derivation',
    ],
    icon: '👋',
  },
  'SSL: Server Hello + Certificate ←': {
    title: 'Server Hello',
    phase: 4,
    color: '#ec4899',
    description: 'Server responds with chosen cipher and its certificate.',
    details: [
      'Selects TLS version and cipher suite',
      'Sends server certificate (proves identity)',
      "Certificate is verified against browser's trusted CAs",
    ],
    icon: '📜',
  },
  'SSL: Key Exchange →': {
    title: 'Key Exchange',
    phase: 4,
    color: '#ec4899',
    description: 'Both parties exchange data to derive shared secret keys.',
    details: [
      'Uses Diffie-Hellman or ECDHE for forward secrecy',
      'Neither party ever sends the actual key',
      'Both derive the same key independently',
    ],
    icon: '🔑',
  },
  'SSL: Secure connection established! 🔒': {
    title: 'Secure Connection',
    phase: 4,
    color: '#22c55e',
    description: 'TLS handshake complete. All data is now encrypted.',
    details: [
      'Session keys are now shared',
      'All subsequent data is encrypted with AES (typically)',
      'HMAC ensures data integrity',
    ],
    icon: '🔒',
  },
  'Sending encrypted HTTP GET request...': {
    title: 'HTTPS Request',
    phase: 5,
    color: '#3b82f6',
    description: 'The actual HTTP request is now sent, encrypted within TLS.',
    details: [
      'GET / HTTP/1.1 or HTTP/2 request',
      'Headers include Host, User-Agent, Accept, etc.',
      'All encrypted - only server can decrypt',
    ],
    icon: '📤',
  },
  'Load Balancer: Routing to server...': {
    title: 'Load Balancing',
    phase: 5,
    color: '#06b6d4',
    description:
      "Google's load balancer distributes your request across thousands of servers.",
    details: [
      'Load balancers sit at edge of Google data centers',
      'Uses algorithms like Round Robin, Least Connections, or IP Hash',
      'Routes to nearest healthy server with lowest load',
      'Enables horizontal scaling and high availability',
    ],
    icon: '⚖️',
  },
  'Server processing request...': {
    title: 'Server Processing',
    phase: 5,
    color: '#3b82f6',
    description: "Google's servers process your request.",
    details: [
      'Request reaches one of thousands of identical servers',
      'Server generates personalized response',
      'Database queries, API calls happen server-side',
    ],
    icon: '⚙️',
  },
  'Server sends HTML response ←': {
    title: 'HTML Response',
    phase: 5,
    color: '#10b981',
    description: 'Server responds with HTML document.',
    details: [
      'HTTP 200 OK status code',
      'Content-Type: text/html',
      'Compressed with gzip or brotli',
    ],
    icon: '📄',
  },
  'Browser requests CSS & JS files...': {
    title: 'Additional Requests',
    phase: 5,
    color: '#3b82f6',
    description: 'Browser parses HTML and discovers additional resources.',
    details: [
      'Finds <link>, <script>, <img> tags',
      'Opens parallel connections for resources',
      'HTTP/2 allows multiplexing over single connection',
    ],
    icon: '📦',
  },
  'Receiving CSS & JS files ←': {
    title: 'Resource Download',
    phase: 5,
    color: '#10b981',
    description: 'CSS and JavaScript files are downloaded.',
    details: [
      'CSS: Stylesheets for visual presentation',
      'JS: Scripts for interactivity',
      'May be cached for future visits',
    ],
    icon: '⬇️',
  },
  '📊 Network Waterfall Timeline': {
    title: 'Network Waterfall',
    phase: 6,
    color: '#8b5cf6',
    description: 'Visual timeline of all network requests and their timing.',
    details: [
      'Shows DNS, TCP, SSL, Request, TTFB, Download phases',
      'Helps identify performance bottlenecks',
      'Available in browser DevTools → Network tab',
    ],
    icon: '📊',
  },
  'Parsing HTML → Building DOM Tree': {
    title: 'DOM Construction',
    phase: 7,
    color: '#f97316',
    description: 'Browser parses HTML and builds the Document Object Model.',
    details: [
      'Tokenizes HTML into tags and text',
      'Builds tree structure of elements',
      'DOM is the API for manipulating page content',
    ],
    icon: '🌳',
  },
  'Parsing CSS → Building CSSOM': {
    title: 'CSSOM Construction',
    phase: 7,
    color: '#3b82f6',
    description: 'CSS is parsed into the CSS Object Model.',
    details: [
      'Parses stylesheets into rules',
      'Calculates specificity and cascade',
      'Required before rendering can begin',
    ],
    icon: '🎨',
  },
  'Combining DOM + CSSOM → Render Tree': {
    title: 'Render Tree',
    phase: 7,
    color: '#22c55e',
    description: 'DOM and CSSOM combine to create the Render Tree.',
    details: [
      'Only visible elements are included',
      'display: none elements are excluded',
      'Each node has content + computed styles',
    ],
    icon: '🌲',
  },
  'JavaScript Execution & Hydration': {
    title: 'JavaScript Execution',
    phase: 7,
    color: '#eab308',
    description: 'JavaScript is parsed, compiled, and executed.',
    details: [
      'V8 engine compiles JS to machine code',
      'Event listeners are attached to DOM',
      'Hydration connects static HTML to dynamic JS',
    ],
    icon: '⚡',
  },
  'Layout: Calculating positions & sizes': {
    title: 'Layout / Reflow',
    phase: 8,
    color: '#a855f7',
    description: 'Browser calculates exact position and size of every element.',
    details: [
      'Box model: content + padding + border + margin',
      'Flexbox/Grid layouts are computed',
      'Position, float, transforms applied',
    ],
    icon: '📐',
  },
  'Paint: Drawing pixels to layers': {
    title: 'Paint',
    phase: 8,
    color: '#ec4899',
    description: 'Browser draws pixels for each element.',
    details: [
      'Text, colors, images, borders, shadows drawn',
      'Complex elements split into layers',
      'Layers enable efficient repaints',
    ],
    icon: '🖌️',
  },
  '🎮 GPU Rendering Pipeline': {
    title: 'GPU Compositing',
    phase: 8,
    color: '#10b981',
    description: 'GPU combines layers and renders final frame.',
    details: [
      'Layers uploaded to GPU as textures',
      'GPU composites layers with transforms',
      'Achieves smooth 60 FPS animations',
    ],
    icon: '🎮',
  },
  '✓ Page Rendered @ 60 FPS!': {
    title: 'Page Complete!',
    phase: 9,
    color: '#22c55e',
    description: 'The page is fully rendered and interactive.',
    details: [
      'First Contentful Paint (FCP) achieved',
      'Time to Interactive (TTI) reached',
      'User can now interact with the page',
    ],
    icon: '🎉',
  },
};

// Fallback for unmatched states
const defaultExplanation = {
  title: 'Network Journey',
  phase: 1,
  color: '#3b82f6',
  description:
    'Follow the journey of a network request from your browser to the server and back.',
  details: [
    'Scroll down to see each step',
    'Watch packets travel through the network',
    'Learn how the web really works',
  ],
  icon: '🌐',
};

export default function ExplanationSidebar({ state }) {
  // Derive explanation directly from state
  const explanation = phaseExplanations[state] || defaultExplanation;

  return (
    <div
      style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '320px',
        maxHeight: '70vh',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        zIndex: 1000,
        boxShadow:
          '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        overflowY: 'auto',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Phase badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: `${explanation.color}15`,
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '16px' }}>{explanation.icon}</span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: explanation.color,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Phase {explanation.phase}
        </span>
      </div>

      {/* Title */}
      <h2
        style={{
          margin: '0 0 12px 0',
          fontSize: '22px',
          fontWeight: 700,
          color: '#f8fafc',
          lineHeight: 1.3,
        }}
      >
        {explanation.title}
      </h2>

      {/* Description */}
      <p
        style={{
          margin: '0 0 20px 0',
          fontSize: '14px',
          lineHeight: 1.6,
          color: '#cbd5e1',
        }}
      >
        {explanation.description}
      </p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'rgba(148, 163, 184, 0.2)',
          margin: '0 0 16px 0',
        }}
      />

      {/* Details list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {explanation.details.map((detail, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: explanation.color,
                marginTop: '6px',
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                lineHeight: 1.5,
                color: '#94a3b8',
              }}
            >
              {detail}
            </p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <span style={{ fontSize: '14px' }}>↓</span>
        <span
          style={{
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          Scroll to continue the journey
        </span>
      </div>
    </div>
  );
}
