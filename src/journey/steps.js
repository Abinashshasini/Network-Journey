// The journey script: one entry per step, in playback order.
// start/end are positions on the master timeline (0–1) that the camera and
// packet timelines are authored against. `layer` picks the accent colour.
//
// Generated from the former Scene.getSearchState + ExplanationSidebar tables.

export const CHAPTERS = [
  { id: "local", name: "Local network", short: "LAN", start: 0, layer: "link" },
  { id: "internet", name: "Internet backbone", short: "WAN", start: 0.12, layer: "network" },
  { id: "dns", name: "DNS lookup", short: "DNS", start: 0.22, layer: "application" },
  { id: "tcp", name: "TCP handshake", short: "TCP", start: 0.32, layer: "transport" },
  { id: "tls", name: "TLS handshake", short: "TLS", start: 0.40, layer: "security" },
  { id: "http", name: "HTTP request", short: "HTTP", start: 0.54, layer: "application" },
  { id: "render", name: "Browser rendering", short: "Render", start: 0.68, layer: "browser" },
  { id: "done", name: "Done", short: "Done", start: 0.90, layer: "browser" },
];

export const STEPS = [
  {
    "start": 0,
    "end": 0.02,
    "chapter": "local",
    "layer": "application",
    "status": "User types google.com",
    "title": "User Input",
    "description": "When you type 'google.com' in your browser's address bar and press Enter, the browser initiates a complex series of network operations.",
    "details": [
      "Browser parses the URL to extract the protocol (HTTPS), domain (google.com), and path",
      "Checks browser cache for recently resolved DNS entries",
      "If not cached, prepares to perform a DNS lookup"
    ]
  },
  {
    "start": 0.02,
    "end": 0.04,
    "chapter": "local",
    "layer": "application",
    "status": "Browser creates HTTP request",
    "title": "HTTP Request Creation",
    "description": "The browser constructs an HTTP request with headers, cookies, and other metadata.",
    "details": [
      "Sets request method (GET for page loads)",
      "Adds User-Agent, Accept-Language, and other headers",
      "Includes any cookies for the domain"
    ]
  },
  {
    "start": 0.04,
    "end": 0.05,
    "chapter": "local",
    "layer": "application",
    "status": "Service Worker: Checking cache…",
    "title": "Service Worker Check",
    "description": "Before hitting the network, the browser checks if a Service Worker intercepts this request.",
    "details": [
      "Service Workers run in a separate thread from the main page",
      "Can intercept fetch requests and serve cached responses",
      "Enables offline-first Progressive Web Apps (PWAs)",
      "If no match in cache, the request continues to the network"
    ]
  },
  {
    "start": 0.05,
    "end": 0.06,
    "chapter": "local",
    "layer": "application",
    "status": "Service Worker: Cache MISS → Network",
    "title": "Cache Miss",
    "description": "No cached response found. The request will proceed through the full network stack.",
    "details": [
      "First visit to google.com - nothing in the SW cache yet",
      "On subsequent visits, the SW could serve cached resources instantly",
      "Cache strategies: Cache First, Network First, Stale While Revalidate"
    ]
  },
  {
    "start": 0.06,
    "end": 0.07,
    "chapter": "local",
    "layer": "transport",
    "status": "OS: Socket creation & network stack",
    "title": "OS Network Stack",
    "description": "The OS creates a socket and the request travels down through the network stack layers.",
    "details": [
      "Application Layer: HTTP request data",
      "Transport Layer: TCP segments with port numbers",
      "Network Layer: IP packets with source/destination IPs",
      "Data Link Layer: Ethernet frames with MAC addresses",
      "Physical Layer: Electrical signals, radio waves, or light pulses"
    ]
  },
  {
    "start": 0.07,
    "end": 0.08,
    "chapter": "local",
    "layer": "link",
    "status": "ARP: Who has 192.168.1.1?",
    "title": "ARP Request",
    "description": "Before sending to the router, your device needs its MAC (hardware) address using ARP.",
    "details": [
      "ARP = Address Resolution Protocol",
      "Broadcasts \"Who has IP 192.168.1.1?\" to all devices on local network",
      "MAC addresses are needed for Layer 2 (Data Link) communication",
      "Without the MAC, packets cannot be delivered on the local network"
    ]
  },
  {
    "start": 0.08,
    "end": 0.09,
    "chapter": "local",
    "layer": "link",
    "status": "ARP: Router MAC: AA:BB:CC:11:22:33",
    "title": "ARP Response",
    "description": "The router responds with its MAC address, which gets cached for future use.",
    "details": [
      "Router responds: \"192.168.1.1 is at AA:BB:CC:11:22:33\"",
      "Your device caches this in its ARP table",
      "ARP cache typically expires after 15-20 minutes",
      "Now packets can be addressed to the router"
    ]
  },
  {
    "start": 0.09,
    "end": 0.12,
    "chapter": "local",
    "layer": "link",
    "status": "Sending to Router via WiFi…",
    "title": "Local Network",
    "description": "Your request leaves your device and travels through your local network.",
    "details": [
      "Data is converted to WiFi radio signals (802.11)",
      "Packet includes both IP address AND MAC address",
      "Router receives the packet on its LAN interface"
    ]
  },
  {
    "start": 0.12,
    "end": 0.13,
    "chapter": "internet",
    "layer": "network",
    "status": "NAT: 192.168.1.5 → 203.45.67.89",
    "title": "NAT Translation",
    "description": "Network Address Translation converts your private IP to a public IP for internet routing.",
    "details": [
      "Private IPs (192.168.x.x) cannot be routed on the internet",
      "NAT maps: Private IP:Port -> Public IP:Port",
      "Creates entry in NAT table to track the connection",
      "Enables multiple devices to share one public IP"
    ]
  },
  {
    "start": 0.13,
    "end": 0.14,
    "chapter": "internet",
    "layer": "network",
    "status": "Router forwarding to ISP…",
    "title": "ISP Connection",
    "description": "Your router forwards the request to your Internet Service Provider's network.",
    "details": [
      "Packet travels through copper/fiber to ISP's infrastructure",
      "ISP routes packet based on destination IP",
      "Multiple hops through ISP internal routers"
    ]
  },
  {
    "start": 0.14,
    "end": 0.16,
    "chapter": "internet",
    "layer": "network",
    "status": "BGP: Routing through autonomous systems",
    "title": "BGP Routing",
    "description": "The Border Gateway Protocol determines the best path across the internet backbone.",
    "details": [
      "BGP connects Autonomous Systems (AS) - large network domains",
      "Each AS has a unique number (e.g., Google is AS15169)",
      "BGP routers exchange routing tables with neighbors",
      "Path selection considers: shortest AS path, policies, and peering agreements",
      "Your packet may traverse 5-15 autonomous systems to reach Google"
    ]
  },
  {
    "start": 0.16,
    "end": 0.22,
    "chapter": "internet",
    "layer": "network",
    "status": "Traveling through submarine cable…",
    "title": "Submarine Cable",
    "description": "Data crosses oceans through fiber optic cables laid on the ocean floor.",
    "details": [
      "Over 400 submarine cables connect continents",
      "Light pulses travel at ~200,000 km/s through fiber",
      "Cables are only about 17mm thick but carry 99% of intercontinental data",
      "Repeaters boost the signal every 50-100km along the cable"
    ]
  },
  {
    "start": 0.22,
    "end": 0.24,
    "chapter": "dns",
    "layer": "application",
    "status": "Reaching DNS Server…",
    "title": "DNS Server",
    "description": "The request reaches a DNS (Domain Name System) server to resolve the domain name.",
    "details": [
      "DNS is like the internet's phone book",
      "Translates human-readable domain names to IP addresses",
      "Hierarchical system: Root -> TLD -> Authoritative servers"
    ]
  },
  {
    "start": 0.24,
    "end": 0.27,
    "chapter": "dns",
    "layer": "application",
    "status": "DNS Query: \"What is google.com?\"",
    "title": "DNS Query",
    "description": "Your browser asks the DNS resolver: 'What is the IP address for google.com?'",
    "details": [
      "Query type: A record (IPv4) or AAAA record (IPv6)",
      "Recursive resolver checks its cache first",
      "If not cached, queries root -> .com TLD -> google.com authoritative server"
    ]
  },
  {
    "start": 0.27,
    "end": 0.29,
    "chapter": "dns",
    "layer": "application",
    "status": "DNS Response: 142.250.190.14",
    "title": "DNS Response",
    "description": "DNS server responds with google.com's IP address.",
    "details": [
      "Response includes IP address(es) and TTL (Time To Live)",
      "TTL tells browsers how long to cache this result",
      "Multiple IPs may be returned for load balancing"
    ]
  },
  {
    "start": 0.29,
    "end": 0.32,
    "chapter": "dns",
    "layer": "application",
    "status": "CDN Edge: Cache check → MISS",
    "title": "CDN Edge Check",
    "description": "Before reaching the origin server, the request hits a CDN edge node that checks for cached content.",
    "details": [
      "CDN = Content Delivery Network (e.g., Cloudflare, Akamai)",
      "Edge nodes are geographically distributed near users",
      "Static assets (images, CSS, JS) are often cached at the edge",
      "Cache MISS: This is a dynamic page request, so we continue to origin",
      "Cache HIT would have returned the response in < 10ms!"
    ]
  },
  {
    "start": 0.32,
    "end": 0.34,
    "chapter": "tcp",
    "layer": "transport",
    "status": "Initiating TCP connection…",
    "title": "TCP Connection",
    "description": "Before sending data, a reliable TCP connection must be established.",
    "details": [
      "TCP ensures reliable, ordered delivery of data",
      "Uses port 443 for HTTPS (port 80 for HTTP)",
      "Connection is full-duplex (bidirectional)"
    ]
  },
  {
    "start": 0.34,
    "end": 0.36,
    "chapter": "tcp",
    "layer": "transport",
    "status": "TCP: Sending SYN packet →",
    "title": "SYN - Step 1 of 3",
    "description": "Client sends SYN (synchronize) packet to initiate connection.",
    "details": [
      "SYN flag is set to 1",
      "Client picks a random initial sequence number",
      "Says: 'I want to connect, starting at sequence X'"
    ]
  },
  {
    "start": 0.36,
    "end": 0.38,
    "chapter": "tcp",
    "layer": "transport",
    "status": "TCP: Received SYN-ACK ←",
    "title": "SYN-ACK - Step 2 of 3",
    "description": "Server acknowledges and sends its own synchronization.",
    "details": [
      "Server sets both SYN and ACK flags",
      "Acknowledges client's sequence + 1",
      "Says: 'OK, I acknowledge X+1, my sequence starts at Y'"
    ]
  },
  {
    "start": 0.38,
    "end": 0.4,
    "chapter": "tcp",
    "layer": "transport",
    "status": "TCP: Sending ACK → Connected!",
    "title": "ACK - Step 3 of 3",
    "description": "Client acknowledges server, completing the three-way handshake.",
    "details": [
      "ACK flag set, acknowledges server sequence + 1",
      "Connection is now ESTABLISHED",
      "Both parties can now send data"
    ]
  },
  {
    "start": 0.4,
    "end": 0.42,
    "chapter": "tls",
    "layer": "security",
    "status": "Starting SSL/TLS Handshake…",
    "title": "SSL/TLS Handshake",
    "description": "On top of TCP, TLS creates an encrypted tunnel for secure communication.",
    "details": [
      "TLS 1.3 is the current standard (TLS 1.2 still common)",
      "Ensures confidentiality, integrity, and authentication",
      "Uses asymmetric crypto for key exchange, symmetric for data"
    ]
  },
  {
    "start": 0.42,
    "end": 0.44,
    "chapter": "tls",
    "layer": "security",
    "status": "SSL: Client Hello →",
    "title": "Client Hello",
    "description": "Client announces supported TLS versions and cipher suites.",
    "details": [
      "Sends supported TLS versions (1.2, 1.3)",
      "Lists cipher suites in preference order",
      "Includes a random number for key derivation"
    ]
  },
  {
    "start": 0.44,
    "end": 0.46,
    "chapter": "tls",
    "layer": "security",
    "status": "SSL: Server Hello + Certificate ←",
    "title": "Server Hello",
    "description": "Server responds with chosen cipher and its certificate.",
    "details": [
      "Selects TLS version and cipher suite",
      "Sends server certificate (proves identity)",
      "Certificate is verified against browser's trusted CAs"
    ]
  },
  {
    "start": 0.46,
    "end": 0.48,
    "chapter": "tls",
    "layer": "security",
    "status": "SSL: Key Exchange →",
    "title": "Key Exchange",
    "description": "Both parties exchange data to derive shared secret keys.",
    "details": [
      "Uses Diffie-Hellman or ECDHE for forward secrecy",
      "Neither party ever sends the actual key",
      "Both derive the same key independently"
    ]
  },
  {
    "start": 0.48,
    "end": 0.54,
    "chapter": "tls",
    "layer": "security",
    "status": "SSL: Secure connection established!",
    "title": "Secure Connection",
    "description": "TLS handshake complete. All data is now encrypted.",
    "details": [
      "Session keys are now shared",
      "All subsequent data is encrypted with AES (typically)",
      "HMAC ensures data integrity"
    ]
  },
  {
    "start": 0.54,
    "end": 0.56,
    "chapter": "http",
    "layer": "application",
    "status": "Sending encrypted HTTP GET request…",
    "title": "HTTPS Request",
    "description": "The actual HTTP request is now sent, encrypted within TLS.",
    "details": [
      "GET / HTTP/1.1 or HTTP/2 request",
      "Headers include Host, User-Agent, Accept, etc.",
      "All encrypted - only server can decrypt"
    ]
  },
  {
    "start": 0.56,
    "end": 0.58,
    "chapter": "http",
    "layer": "application",
    "status": "Load Balancer: Routing to server…",
    "title": "Load Balancing",
    "description": "Google's load balancer distributes your request across thousands of servers.",
    "details": [
      "Load balancers sit at edge of Google data centers",
      "Uses algorithms like Round Robin, Least Connections, or IP Hash",
      "Routes to nearest healthy server with lowest load",
      "Enables horizontal scaling and high availability"
    ]
  },
  {
    "start": 0.58,
    "end": 0.6,
    "chapter": "http",
    "layer": "application",
    "status": "Server processing request…",
    "title": "Server Processing",
    "description": "Google's servers process your request.",
    "details": [
      "Request reaches one of thousands of identical servers",
      "Server generates personalized response",
      "Database queries, API calls happen server-side"
    ]
  },
  {
    "start": 0.6,
    "end": 0.62,
    "chapter": "http",
    "layer": "application",
    "status": "Server sends HTML response ←",
    "title": "HTML Response",
    "description": "Server responds with HTML document.",
    "details": [
      "HTTP 200 OK status code",
      "Content-Type: text/html",
      "Compressed with gzip or brotli"
    ]
  },
  {
    "start": 0.62,
    "end": 0.64,
    "chapter": "http",
    "layer": "application",
    "status": "Browser requests CSS & JS files…",
    "title": "Additional Requests",
    "description": "Browser parses HTML and discovers additional resources.",
    "details": [
      "Finds <link>, <script>, <img> tags",
      "Opens parallel connections for resources",
      "HTTP/2 allows multiplexing over single connection"
    ]
  },
  {
    "start": 0.64,
    "end": 0.66,
    "chapter": "http",
    "layer": "application",
    "status": "Receiving CSS & JS files ←",
    "title": "Resource Download",
    "description": "CSS and JavaScript files are downloaded.",
    "details": [
      "CSS: Stylesheets for visual presentation",
      "JS: Scripts for interactivity",
      "May be cached for future visits"
    ]
  },
  {
    "start": 0.66,
    "end": 0.68,
    "chapter": "http",
    "layer": "application",
    "status": "Network Waterfall Timeline",
    "title": "Network Waterfall",
    "description": "Visual timeline of all network requests and their timing.",
    "details": [
      "Shows DNS, TCP, SSL, Request, TTFB, Download phases",
      "Helps identify performance bottlenecks",
      "Available in browser DevTools -> Network tab"
    ]
  },
  {
    "start": 0.68,
    "end": 0.71,
    "chapter": "render",
    "layer": "browser",
    "status": "Parsing HTML → Building DOM Tree",
    "title": "DOM Construction",
    "description": "Browser parses HTML and builds the Document Object Model.",
    "details": [
      "Tokenizes HTML into tags and text",
      "Builds tree structure of elements",
      "DOM is the API for manipulating page content"
    ]
  },
  {
    "start": 0.71,
    "end": 0.74,
    "chapter": "render",
    "layer": "browser",
    "status": "Parsing CSS → Building CSSOM",
    "title": "CSSOM Construction",
    "description": "CSS is parsed into the CSS Object Model.",
    "details": [
      "Parses stylesheets into rules",
      "Calculates specificity and cascade",
      "Required before rendering can begin"
    ]
  },
  {
    "start": 0.74,
    "end": 0.77,
    "chapter": "render",
    "layer": "browser",
    "status": "Combining DOM + CSSOM → Render Tree",
    "title": "Render Tree",
    "description": "DOM and CSSOM combine to create the Render Tree.",
    "details": [
      "Only visible elements are included",
      "display: none elements are excluded",
      "Each node has content + computed styles"
    ]
  },
  {
    "start": 0.77,
    "end": 0.8,
    "chapter": "render",
    "layer": "browser",
    "status": "JavaScript Execution & Hydration",
    "title": "JavaScript Execution",
    "description": "JavaScript is parsed, compiled, and executed.",
    "details": [
      "V8 engine compiles JS to machine code",
      "Event listeners are attached to DOM",
      "Hydration connects static HTML to dynamic JS"
    ]
  },
  {
    "start": 0.8,
    "end": 0.83,
    "chapter": "render",
    "layer": "browser",
    "status": "Layout: Calculating positions & sizes",
    "title": "Layout / Reflow",
    "description": "Browser calculates exact position and size of every element.",
    "details": [
      "Box model: content + padding + border + margin",
      "Flexbox/Grid layouts are computed",
      "Position, float, transforms applied"
    ]
  },
  {
    "start": 0.83,
    "end": 0.86,
    "chapter": "render",
    "layer": "browser",
    "status": "Paint: Drawing pixels to layers",
    "title": "Paint",
    "description": "Browser draws pixels for each element.",
    "details": [
      "Text, colors, images, borders, shadows drawn",
      "Complex elements split into layers",
      "Layers enable efficient repaints"
    ]
  },
  {
    "start": 0.86,
    "end": 0.9,
    "chapter": "render",
    "layer": "browser",
    "status": "GPU Rendering Pipeline",
    "title": "GPU Compositing",
    "description": "GPU combines layers and renders final frame.",
    "details": [
      "Layers uploaded to GPU as textures",
      "GPU composites layers with transforms",
      "Achieves smooth 60 FPS animations"
    ]
  },
  {
    "start": 0.9,
    "end": 0.94,
    "chapter": "done",
    "layer": "browser",
    "status": "Web Vitals: LCP, FID, CLS",
    "title": "Core Web Vitals",
    "description": "Google's metrics for measuring real user experience quality.",
    "details": [
      "LCP (Largest Contentful Paint): < 2.5s for good UX",
      "FID (First Input Delay): < 100ms for responsiveness",
      "CLS (Cumulative Layout Shift): < 0.1 for visual stability",
      "INP (Interaction to Next Paint): replacing FID in 2024",
      "These metrics directly impact Google search rankings"
    ]
  },
  {
    "start": 0.94,
    "end": 1,
    "chapter": "done",
    "layer": "browser",
    "status": "Page Rendered @ 60 FPS!",
    "title": "Page Complete!",
    "description": "The page is fully rendered and interactive.",
    "details": [
      "First Contentful Paint (FCP) achieved",
      "Time to Interactive (TTI) reached",
      "User can now interact with the page"
    ]
  }
];
